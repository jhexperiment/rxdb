import {
    RxJsonSchema,
    RxStorageInstanceCreationParams,
    RxStorageInstance,
    getPrimaryFieldOfPrimaryKey,
    EventBulk,
    RxStorageChangeEvent,
    RxDocumentData,
    BulkWriteRow,
    RxStorageBulkWriteResponse,
    RxStorageQueryResult,
    categorizeBulkWriteRows,
    ensureNotFalsy,
    StringKeys,
    addRxStorageMultiInstanceSupport,
    RxStorageDefaultCheckpoint,
    CategorizeBulkWriteRowsOutput,
    RxStorageCountResult,
    promiseWait,
    PreparedQuery,
    hasPremiumFlag
} from '../../index.ts';
import { BehaviorSubject, Observable, Subject, filter, firstValueFrom } from 'rxjs';
import type { RxStorageSQLiteTrial } from './index.ts';
import {
    closeDatabaseConnection,
    ensureParamsCountIsCorrect,
    getDatabaseConnection,
    getSQLiteUpdateSQL,
    RX_STORAGE_NAME_SQLITE,
    sqliteTransaction,
    getDataFromResultRow,
    getSQLiteInsertSQL,
    TX_QUEUE_BY_DATABASE
} from './sqlite-helpers.ts';
import type {
    SQLiteBasics,
    SQLiteInstanceCreationOptions,
    SQLiteInternals,
    SQLiteQueryWithParams,
    SQLiteStorageSettings
} from './sqlite-types.ts';
import { newRxError } from '../../rx-error.ts';
let shownNonPremiumLog = false;
let instanceId = 0;

/**
 * Limits of the free trial SQLite storage.
 * Reaching them throws an error, see the error codes SQL2 and SQL3.
 * Deleted documents are kept as tombstones for the replication but do
 * NOT count towards the document limit.
 * Use the premium SQLite storage to remove these limits:
 * @link https://rxdb.info/premium/
 */
export const TRIAL_SQLITE_DOCUMENT_LIMIT = 500;
export const TRIAL_SQLITE_OPERATION_LIMIT = 500;
/**
 * Ratio of the limits at which a loud warning is logged on each write.
 */
const TRIAL_SQLITE_WARN_RATIO = 0.8;

export class RxStorageInstanceSQLite<RxDocType> implements RxStorageInstance<
    RxDocType,
    SQLiteInternals,
    SQLiteInstanceCreationOptions,
    RxStorageDefaultCheckpoint
> {
    public readonly primaryPath: StringKeys<RxDocType>;
    private changes$: Subject<EventBulk<RxStorageChangeEvent<RxDocumentData<RxDocType>>, RxStorageDefaultCheckpoint>> = new Subject();
    public readonly instanceId = instanceId++;
    public closed?: Promise<void>;

    public sqliteBasics: SQLiteBasics<any>;

    public readonly openWriteCount$ = new BehaviorSubject(0);


    private opCount = 0;

    constructor(
        public readonly storage: RxStorageSQLiteTrial,
        public readonly databaseName: string,
        public readonly collectionName: string,
        public readonly schema: Readonly<RxJsonSchema<RxDocumentData<RxDocType>>>,
        public readonly internals: SQLiteInternals,
        public readonly options: Readonly<SQLiteInstanceCreationOptions>,
        public readonly settings: SQLiteStorageSettings,
        public readonly tableName: string,
        public readonly devMode: boolean
    ) {
        this.sqliteBasics = storage.settings.sqliteBasics;
        this.primaryPath = getPrimaryFieldOfPrimaryKey(this.schema.primaryKey) as any;
    }


    run(
        db: any,
        queryWithParams: SQLiteQueryWithParams
    ) {
        if (this.devMode) {
            ensureParamsCountIsCorrect(queryWithParams);
        }
        return this.sqliteBasics.run(db, queryWithParams);
    }
    all(
        db: any,
        queryWithParams: SQLiteQueryWithParams
    ) {
        if (this.devMode) {
            ensureParamsCountIsCorrect(queryWithParams);
        }

        // Trial operation limit disabled for production mobile use.
        // this.opCount = this.opCount + 1;
        // if (this.opCount > TRIAL_SQLITE_OPERATION_LIMIT) {
        //     throw newRxError('SQL3');
        // }

        return this.sqliteBasics.all(db, queryWithParams);
    }

    /**
     * @link https://medium.com/@JasonWyatt/squeezing-performance-from-sqlite-insertions-971aff98eef2
     */
    async bulkWrite(
        documentWrites: BulkWriteRow<RxDocType>[],
        context: string
    ): Promise<RxStorageBulkWriteResponse<RxDocType>> {
        this.openWriteCount$.next(this.openWriteCount$.getValue() + 1);
        const database = await this.internals.databasePromise;
        const ret: RxStorageBulkWriteResponse<RxDocType> = {
            error: []
        };
        const writePromises: Promise<any>[] = [];
        let categorized: CategorizeBulkWriteRowsOutput<RxDocType> = {} as any;

        const isPremium = await hasPremiumFlag();
        if (
            !shownNonPremiumLog &&
            !isPremium
        ) {
            console.warn(
                [
                    '-------------- RxDB SQLite Trial Storage ---------------------------------',
                    'You are using the free *trial* SQLite-based RxStorage implementation: https://rxdb.info/rx-storage-sqlite.html?console=sqlite-trial',
                    'This storage is intended only for evaluation purposes and comes with strict limitations (no indexes, no attachments, and a ~500-document cap).',
                    'For production use and optimal performance, we strongly recommend upgrading to the premium SQLite storage.',
                    'Premium version: https://rxdb.info/premium/?console=sqlite',
                    'If you already have premium access, you can disable this message by calling setPremiumFlag() from rxdb-premium/plugins/shared.',
                    '----------------------------------------------------------------------------'
                ].join('\n')
            );
            shownNonPremiumLog = true;
        } else {
            shownNonPremiumLog = true;
        }

        await sqliteTransaction(
            database,
            this.sqliteBasics,
            async () => {
                if (this.closed) {
                    this.openWriteCount$.next(this.openWriteCount$.getValue() - 1);
                    throw new Error('SQLite.bulkWrite(' + context + ') already closed ' + this.tableName + ' context: ' + context);
                }
                const result = await this.all(
                    database,
                    {
                        query: `SELECT data FROM "${this.tableName}"`,
                        params: [],
                        context: {
                            method: 'bulkWrite',
                            data: documentWrites
                        }
                    }
                );

                const docsInDb: Map<RxDocumentData<RxDocType>[StringKeys<RxDocType>], RxDocumentData<RxDocType>> = new Map();
                result.forEach(docSQLResult => {
                    const doc = JSON.parse(getDataFromResultRow(docSQLResult));
                    const id = doc[this.primaryPath];
                    docsInDb.set(id, doc);
                });
                categorized = categorizeBulkWriteRows(
                    this,
                    this.primaryPath,
                    docsInDb,
                    documentWrites,
                    context
                );
                ret.error = categorized.errors;

                /**
                 * Deleted documents are kept as tombstones for the replication
                 * but must NOT count towards the trial document limit.
                 * Therefore we count the resulting amount of non-deleted documents.
                 */
                let liveDocCount = 0;
                docsInDb.forEach(doc => {
                    if (!doc._deleted) {
                        liveDocCount = liveDocCount + 1;
                    }
                });
                categorized.bulkInsertDocs.forEach(row => {
                    if (!row.document._deleted) {
                        liveDocCount = liveDocCount + 1;
                    }
                });
                categorized.bulkUpdateDocs.forEach(row => {
                    const previous = docsInDb.get(row.document[this.primaryPath]);
                    const wasLive = !!previous && !previous._deleted;
                    const isLive = !row.document._deleted;
                    if (wasLive && !isLive) {
                        liveDocCount = liveDocCount - 1;
                    } else if (!wasLive && isLive) {
                        liveDocCount = liveDocCount + 1;
                    }
                });

                if (
                    !isPremium &&
                    (
                        liveDocCount >= Math.floor(TRIAL_SQLITE_DOCUMENT_LIMIT * TRIAL_SQLITE_WARN_RATIO) ||
                        this.opCount >= Math.floor(TRIAL_SQLITE_OPERATION_LIMIT * TRIAL_SQLITE_WARN_RATIO)
                    )
                ) {
                    console.warn(
                        [
                            '-------------- RxDB SQLite Trial Storage - Limit Almost Reached ----------------',
                            'You are close to the limits of the free *trial* SQLite RxStorage.',
                            'Current usage: ' + liveDocCount + ' / ' + TRIAL_SQLITE_DOCUMENT_LIMIT + ' documents and ' +
                            this.opCount + ' / ' + TRIAL_SQLITE_OPERATION_LIMIT + ' operations.',
                            'When a limit is reached, your read and write operations will start to throw errors.',
                            'Upgrade to the premium SQLite storage to remove these limits and get full performance:',
                            'https://rxdb.info/premium/?console=sqlite-trial-limit',
                            '--------------------------------------------------------------------------------'
                        ].join('\n')
                    );
                }

                // Trial document limit disabled for production mobile use.
                // if (liveDocCount > TRIAL_SQLITE_DOCUMENT_LIMIT) {
                //     throw newRxError('SQL2');
                // }

                categorized.bulkInsertDocs.forEach(row => {
                    const insertQuery = getSQLiteInsertSQL(
                        this.tableName,
                        this.primaryPath as any,
                        row.document
                    );
                    writePromises.push(
                        this.all(
                            database,
                            {
                                query: insertQuery.query,
                                params: insertQuery.params,
                                context: {
                                    method: 'bulkWrite',
                                    data: categorized
                                }
                            }
                        )
                    );
                });

                categorized.bulkUpdateDocs.forEach(row => {
                    const updateQuery = getSQLiteUpdateSQL<RxDocType>(
                        this.tableName,
                        this.primaryPath,
                        row
                    );
                    writePromises.push(
                        this.run(
                            database,
                            updateQuery
                        )
                    );
                });

                await Promise.all(writePromises);

                // close transaction
                if (this.closed) {
                    this.openWriteCount$.next(this.openWriteCount$.getValue() - 1);
                    return 'ROLLBACK';
                } else {
                    this.openWriteCount$.next(this.openWriteCount$.getValue() - 1);
                    return 'COMMIT';
                }
            },
            {
                databaseName: this.databaseName,
                collectionName: this.collectionName
            }
        );

        if (categorized && categorized.eventBulk.events.length > 0) {
            const lastState = ensureNotFalsy(categorized.newestRow).document;
            categorized.eventBulk.checkpoint = {
                id: lastState[this.primaryPath],
                lwt: lastState._meta.lwt
            };
            this.changes$.next(categorized.eventBulk);
        }

        return ret;
    }


    async query(
        originalPreparedQuery: PreparedQuery<RxDocType>
    ): Promise<RxStorageQueryResult<RxDocType>> {

        const database = await this.internals.databasePromise;

        let result: RxDocumentData<RxDocType>[] = [];
        const query = originalPreparedQuery.query;
        const skip = query.skip ? query.skip : 0;
        /**
         * Use typeof so an explicit `limit: 0` from the mango query is
         * honored. The previous truthy check treated `0` as "no limit"
         * and returned all matching documents.
         */
        const limit = typeof query.limit === 'number' ? query.limit : Infinity;

        const rawIndexes = this.schema.indexes || [];
        const indexedFields = extractIndexedFields(rawIndexes);

        let whereClause = '';
        const params: any[] = [];
        if (query.selector) {
            const conditions = buildConditions(query.selector, params, indexedFields);
            if (conditions.length > 0) {
                whereClause = 'WHERE ' + conditions.join(' AND ');
            }
        }

        const orderByClause = buildSortConditions(query.sort, indexedFields, query.selector);
        const orderBy = orderByClause ? `ORDER BY ${orderByClause}` : '';

        let limitOffsetClause = '';
        const limitOffsetParams: any[] = [];
        if (typeof limit === 'number' && limit !== Infinity) {
            limitOffsetClause += ' LIMIT ?';
            limitOffsetParams.push(limit);
        }
        if (skip) {
            limitOffsetClause += ' OFFSET ?';
            limitOffsetParams.push(skip);
        }

        const subResult = await this.all(database, {
            query: `SELECT data FROM "${this.tableName}" ${whereClause} ${orderBy}${limitOffsetClause};`,
            params: [...params, ...limitOffsetParams],
            context: {
                method: 'query',
                data: originalPreparedQuery
            }
        });

        subResult.forEach((row) => {
            const docData = JSON.parse(getDataFromResultRow(row));
            result.push(docData);
        });
        return {
            documents: result
        };
    }
    async count(
        originalPreparedQuery: PreparedQuery<RxDocType>
    ): Promise<RxStorageCountResult> {
        const results = await this.query(originalPreparedQuery);
        return {
            count: results.documents.length,
            mode: 'fast'
        };
    }


    async findDocumentsById(
        ids: string[],
        withDeleted: boolean
    ): Promise<RxDocumentData<RxDocType>[]> {
        const database = await this.internals.databasePromise;

        if (this.closed) {
            throw new Error('SQLite.findDocumentsById() already closed ' + this.tableName);
        }

        const result = await this.all(
            database,
            {
                query: `SELECT data FROM "${this.tableName}"`,
                params: [],
                context: {
                    method: 'findDocumentsById',
                    data: ids
                }
            }
        );
        const ret: RxDocumentData<RxDocType>[] = [];
        for (let i = 0; i < result.length; ++i) {
            const resultRow = result[i];
            const doc: RxDocumentData<RxDocType> = JSON.parse(getDataFromResultRow(resultRow));
            if (
                ids.includes((doc as any)[this.primaryPath]) &&
                (
                    withDeleted || !doc._deleted
                )
            ) {
                ret.push(doc);
            }
        }
        return ret;
    }

    changeStream(): Observable<EventBulk<RxStorageChangeEvent<RxDocumentData<RxDocType>>, RxStorageDefaultCheckpoint>> {
        return this.changes$.asObservable();
    }

    async cleanup(minimumDeletedTime: number): Promise<boolean> {
        await promiseWait(0);
        await promiseWait(0);
        const database = await this.internals.databasePromise;

        /**
         * Purge deleted documents
         */
        const minTimestamp = new Date().getTime() - minimumDeletedTime;
        await this.all(
            database,
            {
                query: `
                    DELETE FROM
                        "${this.tableName}"
                    WHERE
                        deleted = 1
                        AND
                        lastWriteTime < ?
                `,
                params: [
                    minTimestamp
                ],
                context: {
                    method: 'cleanup',
                    data: minimumDeletedTime
                }
            }
        );
        return true;
    }

    async getAttachmentData(_documentId: string, _attachmentId: string): Promise<Blob> {
        throw newRxError('SQL1');
    }

    async remove(): Promise<void> {
        if (this.closed) {
            throw new Error('closed already');
        }
        const database = await this.internals.databasePromise;
        const promises = [
            this.run(
                database,
                {
                    query: `DROP TABLE IF EXISTS "${this.tableName}"`,
                    params: [],
                    context: {
                        method: 'remove',
                        data: this.tableName
                    }
                }
            )
        ];
        await Promise.all(promises);
        return this.close();
    }

    async close(): Promise<void> {
        const queue = TX_QUEUE_BY_DATABASE.get(await this.internals.databasePromise);
        if (queue) {
            await queue;
        }

        if (this.closed) {
            return this.closed;
        }
        this.closed = (async () => {
            await firstValueFrom(this.openWriteCount$.pipe(filter((v: number) => v === 0)));
            const database = await this.internals.databasePromise;

            /**
             * First get a transaction
             * to ensure currently running operations
             * are finished
             */
            await sqliteTransaction(
                database,
                this.sqliteBasics,
                () => {
                    return Promise.resolve('COMMIT');
                }
            ).catch(() => { });
            this.changes$.complete();
            await closeDatabaseConnection(
                this.databaseName,
                this.storage.settings.sqliteBasics
            );
        })();
        return this.closed;

    }
}

function extractIndexedFields(rawIndexes: readonly (string | readonly string[])[]): string[] {
    return Array.from(new Set(
        rawIndexes.flatMap(index =>
            Array.isArray(index) ? index : [index]
        )
    ));
}

function buildConditions(
    selector: any,
    params: any[],
    indexedFields: string[]
): string[] {
    const conditions: string[] = [];

    if (selector.$and) {
        const andConditions = selector.$and.map((subSelector: any) => {
            const subConditions = buildConditions(subSelector, params, indexedFields);
            return `(${subConditions.join(' AND ')})`;
        });
        conditions.push(...andConditions);
    }

    if (selector.$or) {
        const orConditions = selector.$or.map((subSelector: any) => {
            const subConditions = buildConditions(subSelector, params, indexedFields);
            return `(${subConditions.join(' AND ')})`;
        });
        conditions.push(`(${orConditions.join(' OR ')})`);
    }

    if (selector.$nor) {
        const norConditions = selector.$nor.map((subSelector: any) => {
            const subConditions = buildConditions(subSelector, params, indexedFields);
            return `(${subConditions.join(' AND ')})`;
        });
        conditions.push(`NOT (${norConditions.join(' OR ')})`);
    }

    Object.entries(selector).forEach(([key, value]) => {
        if (key.startsWith('$')) {
            return;
        }

        if (value !== undefined) {
            const fieldName = key.replace(/\./g, '_');
            const fieldPath = indexedFields.includes(key)
                ? `idx_${fieldName}`
                : `json_extract(data, '$.${key}')`;

            if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([op, opValue]) => {
                    switch (op) {
                        case '$eq':
                            conditions.push(`${fieldPath} = ?`);
                            params.push(opValue);
                            break;
                        case '$gt':
                            conditions.push(`${fieldPath} > ?`);
                            params.push(opValue);
                            break;
                        case '$gte':
                            conditions.push(`${fieldPath} >= ?`);
                            params.push(opValue);
                            break;
                        case '$lt':
                            conditions.push(`${fieldPath} < ?`);
                            params.push(opValue);
                            break;
                        case '$lte':
                            conditions.push(`${fieldPath} <= ?`);
                            params.push(opValue);
                            break;
                        case '$in':
                            if (Array.isArray(opValue)) {
                                const placeholders = opValue.map(() => '?').join(',');
                                conditions.push(`${fieldPath} IN (${placeholders})`);
                                params.push(...opValue);
                            }
                            break;
                        case '$nin':
                            if (Array.isArray(opValue)) {
                                const placeholders = opValue.map(() => '?').join(',');
                                conditions.push(`${fieldPath} NOT IN (${placeholders})`);
                                params.push(...opValue);
                            }
                            break;
                        case '$ne':
                            conditions.push(`${fieldPath} != ?`);
                            params.push(opValue);
                            break;
                        case '$exists':
                            if (opValue) {
                                conditions.push(`${fieldPath} IS NOT NULL`);
                            } else {
                                conditions.push(`${fieldPath} IS NULL`);
                            }
                            break;
                        case '$regex':
                            conditions.push(`${fieldPath} REGEXP ?`);
                            params.push(opValue);
                            break;
                    }
                });
            } else {
                conditions.push(`${fieldPath} = ?`);
                params.push(value);
            }
        }
    });

    return conditions;
}

function buildSortConditions(
    sort: any[] | undefined,
    indexedFields: string[],
    selector: any
): string {
    if (!sort || sort.length === 0) {
        return '';
    }

    if (selector && selector._meta?.conditionalSort) {
        const config = selector._meta.conditionalSort;
        return `
      CASE
        WHEN json_extract(data, '$.${config.when.field}') = '${config.when.value}' THEN
          COALESCE(${
            config.then
                .map((f: string) => `json_extract(data, '$.${f}')`)
                .join(', ')
        })
        ELSE json_extract(data, '$.${config.else}')
      END ${config.direction.toUpperCase()}
    `;
    }

    return sort
        .map((sortItem) => {
            const [field, direction] = Object.entries(sortItem)[0] as [string, string];
            const fieldName = field.replace(/\./g, '_');
            const fieldPath = indexedFields.includes(field)
                ? `idx_${fieldName}`
                : `json_extract(data, '$.${field}')`;
            return `${fieldPath} ${direction.toUpperCase()}`;
        })
        .join(', ');
}

export async function createSQLiteTrialStorageInstance<RxDocType>(
    storage: RxStorageSQLiteTrial,
    params: RxStorageInstanceCreationParams<RxDocType, SQLiteInstanceCreationOptions>,
    settings: SQLiteStorageSettings
): Promise<RxStorageInstanceSQLite<RxDocType>> {
    const sqliteBasics = settings.sqliteBasics;
    const tableName = params.collectionName + '-' + params.schema.version;


    if (params.schema.attachments) {
        throw newRxError('SQL1');
    }

    const internals: Partial<SQLiteInternals> = {};
    const useDatabaseName = (settings.databaseNamePrefix ? settings.databaseNamePrefix : '') + '_trial_' + params.databaseName;
    internals.databasePromise = getDatabaseConnection(
        storage.settings.sqliteBasics,
        useDatabaseName
    ).then(async (database) => {
        await sqliteTransaction(
            database,
            sqliteBasics,
            async () => {
                const rawIndexes = params.schema.indexes || [];
                const indexedFields = extractIndexedFields(rawIndexes);

                const tableQuery = `
                CREATE TABLE IF NOT EXISTS "${tableName}"(
                    id TEXT NOT NULL PRIMARY KEY UNIQUE,
                    revision TEXT,
                    deleted BOOLEAN NOT NULL CHECK (deleted IN (0, 1)),
                    lastWriteTime INTEGER NOT NULL,
                    data json,
                    ${indexedFields
                        .map((field) => {
                            const fieldName = Array.isArray(field)
                                ? [...field].join('_')
                                : field;
                            const jsonPath = Array.isArray(field)
                                ? [...field]
                                    .map((f) => `json_extract(data, '$.${f}')`)
                                    .join(' || ')
                                : `json_extract(data, '$.${field}')`;
                            return `idx_${String(fieldName).replace(
                                /\./g,
                                '_'
                            )} TEXT GENERATED ALWAYS AS (${jsonPath}) VIRTUAL`;
                        })
                        .join(',\n    ')}
                );

                ${indexedFields
                    .map((field) => {
                        const fieldName = Array.isArray(field)
                            ? [...field].join('_')
                            : field;
                        const safeFieldName = String(fieldName).replace(/\./g, '_');
                        return `CREATE INDEX IF NOT EXISTS idx_${tableName}_${safeFieldName} ON "${tableName}"(idx_${safeFieldName});`;
                    })
                    .join('\n')}
                `;
                await sqliteBasics.run(
                    database,
                    {
                        query: tableQuery,
                        params: [],
                        context: {
                            method: 'createSQLiteStorageInstance create tables',
                            data: params.databaseName
                        }
                    }
                );
                return 'COMMIT';
            },
            {
                indexCreation: false,
                databaseName: params.databaseName,
                collectionName: params.collectionName
            }
        );
        return database;
    });

    const instance = new RxStorageInstanceSQLite(
        storage,
        params.databaseName,
        params.collectionName,
        params.schema,
        internals as any,
        params.options,
        settings,
        tableName,
        params.devMode
    );

    await addRxStorageMultiInstanceSupport(
        RX_STORAGE_NAME_SQLITE,
        params,
        instance
    );

    return instance;
}
