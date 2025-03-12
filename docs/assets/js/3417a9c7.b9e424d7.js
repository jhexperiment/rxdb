"use strict";(self.webpackChunkrxdb=self.webpackChunkrxdb||[]).push([[5350],{2644:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"articles/firestore-alternative","title":"RxDB - Firestore Alternative to Sync with Your Own Backend","description":"Looking for a Firestore alternative? RxDB is a local-first, NoSQL database that syncs seamlessly with any backend, offers rich offline capabilities, advanced conflict resolution, and reduces vendor lock-in.","source":"@site/docs/articles/firestore-alternative.md","sourceDirName":"articles","slug":"/articles/firestore-alternative.html","permalink":"/articles/firestore-alternative.html","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"RxDB - Firestore Alternative to Sync with Your Own Backend","slug":"firestore-alternative.html","description":"Looking for a Firestore alternative? RxDB is a local-first, NoSQL database that syncs seamlessly with any backend, offers rich offline capabilities, advanced conflict resolution, and reduces vendor lock-in."},"sidebar":"tutorialSidebar","previous":{"title":"RxDB as a Database in a jQuery Application","permalink":"/articles/jquery-database.html"},"next":{"title":"RxDB - Firebase Realtime Database Alternative to Sync With Your Own Backend","permalink":"/articles/firebase-realtime-database-alternative.html"}}');var i=t(4848),a=t(8453);const s={title:"RxDB - Firestore Alternative to Sync with Your Own Backend",slug:"firestore-alternative.html",description:"Looking for a Firestore alternative? RxDB is a local-first, NoSQL database that syncs seamlessly with any backend, offers rich offline capabilities, advanced conflict resolution, and reduces vendor lock-in."},o="RxDB - The Firestore Alternative That Can Sync with Your Own Backend",l={},c=[{value:"What Makes RxDB a Great Firestore Alternative?",id:"what-makes-rxdb-a-great-firestore-alternative",level:2},{value:"1. Fully Offline-First",id:"1-fully-offline-first",level:3},{value:"2. Freedom to Use Any Backend",id:"2-freedom-to-use-any-backend",level:3},{value:"3. Advanced Conflict Resolution",id:"3-advanced-conflict-resolution",level:3},{value:"4. Reduced Cloud Costs",id:"4-reduced-cloud-costs",level:3},{value:"5. No Limits on Query Features",id:"5-no-limits-on-query-features",level:3},{value:"6. True Offline-Start Support",id:"6-true-offline-start-support",level:3},{value:"7. Cross-Platform: Any JavaScript Runtime",id:"7-cross-platform-any-javascript-runtime",level:3},{value:"How Does RxDB&#39;s Sync Work?",id:"how-does-rxdbs-sync-work",level:2},{value:"Getting Started with RxDB as a Firestore Alternative",id:"getting-started-with-rxdb-as-a-firestore-alternative",level:2},{value:"Install RxDB:",id:"install-rxdb",level:3},{value:"Create a Database:",id:"create-a-database",level:3},{value:"Define Collections:",id:"define-collections",level:3},{value:"Sync",id:"sync",level:3},{value:"Example: Start a WebRTC P2P Replication",id:"example-start-a-webrtc-p2p-replication",level:3},{value:"Is RxDB Right for Your Project?",id:"is-rxdb-right-for-your-project",level:2},{value:"Follow Up",id:"follow-up",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"rxdb---the-firestore-alternative-that-can-sync-with-your-own-backend",children:"RxDB - The Firestore Alternative That Can Sync with Your Own Backend"})}),"\n",(0,i.jsxs)(n.p,{children:["If you're seeking a ",(0,i.jsx)(n.strong,{children:"Firestore alternative"}),", you're likely looking for a way to:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Avoid vendor lock-in"})," while still enjoying real-time replication."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Reduce cloud usage costs"})," by reading data locally instead of constantly fetching from the server."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Customize"})," how you store, query, and secure your data."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Implement advanced conflict resolution"})," strategies beyond Firestore's last-write-wins approach."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Enter ",(0,i.jsx)(n.strong,{children:"RxDB"})," (Reactive Database) - a ",(0,i.jsx)(n.a,{href:"/articles/local-first-future.html",children:"local-first"}),", NoSQL database for JavaScript applications that can sync in real time with ",(0,i.jsx)(n.strong,{children:"any"})," backend of your choice. Whether you're tired of the limitations and fees associated with Firebase Cloud Firestore or simply need more flexibility, RxDB might be the Firestore alternative you've been searching for."]}),"\n",(0,i.jsx)("center",{children:(0,i.jsx)("a",{href:"https://rxdb.info/",children:(0,i.jsx)("img",{src:"/files/logo/rxdb_javascript_database.svg",alt:"JavaScript Database",width:"220"})})}),"\n",(0,i.jsx)(n.h2,{id:"what-makes-rxdb-a-great-firestore-alternative",children:"What Makes RxDB a Great Firestore Alternative?"}),"\n",(0,i.jsx)(n.p,{children:"Firestore is convenient for many projects, but it does lock you into Google's ecosystem. Below are some of the key advantages you gain by choosing RxDB:"}),"\n",(0,i.jsx)(n.h3,{id:"1-fully-offline-first",children:"1. Fully Offline-First"}),"\n",(0,i.jsxs)(n.p,{children:["RxDB runs directly in your client application (",(0,i.jsx)(n.a,{href:"/articles/browser-database.html",children:"browser"}),", ",(0,i.jsx)(n.a,{href:"/nodejs-database.html",children:"Node.js"}),", ",(0,i.jsx)(n.a,{href:"/electron-database.html",children:"Electron"}),", ",(0,i.jsx)(n.a,{href:"/react-native-database.html",children:"React Native"}),", etc.). Data is stored locally, so your application ",(0,i.jsx)(n.strong,{children:"remains fully functional even when offline"}),". When the device returns online, RxDB's flexible replication protocol synchronizes your local changes with any remote endpoint."]}),"\n",(0,i.jsx)(n.h3,{id:"2-freedom-to-use-any-backend",children:"2. Freedom to Use Any Backend"}),"\n",(0,i.jsx)(n.p,{children:"Unlike Firestore, RxDB doesn't require a proprietary hosting service. You can:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Host your data on your own server (Node.js, Go, Python, etc.)."}),"\n",(0,i.jsxs)(n.li,{children:["Use existing databases like ",(0,i.jsx)(n.a,{href:"/replication-http.html",children:"PostgreSQL"}),", ",(0,i.jsx)(n.a,{href:"/replication-couchdb.html",children:"CouchDB"}),", or ",(0,i.jsx)(n.a,{href:"/replication.html",children:"MongoDB with custom endpoints"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Implement a ",(0,i.jsx)(n.a,{href:"/replication-graphql.html",children:"custom GraphQL"})," or ",(0,i.jsx)(n.a,{href:"/replication-http.html",children:"REST-based"})," API for syncing."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["This ",(0,i.jsx)(n.strong,{children:"backend-agnostic"})," approach protects you from vendor lock-in. Your application's client-side data storage remains consistent; only your replication logic (or plugin) changes if you switch servers."]}),"\n",(0,i.jsx)(n.h3,{id:"3-advanced-conflict-resolution",children:"3. Advanced Conflict Resolution"}),"\n",(0,i.jsxs)(n.p,{children:["Firestore enforces a ",(0,i.jsx)(n.a,{href:"https://stackoverflow.com/a/47781502/3443137",children:"last-write-wins"})," conflict resolution strategy. This might cause issues if multiple users or devices update the same data in complex ways."]}),"\n",(0,i.jsx)(n.p,{children:"RxDB lets you:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Implement ",(0,i.jsx)(n.strong,{children:"custom conflict resolution"})," via ",(0,i.jsx)(n.a,{href:"/transactions-conflicts-revisions.html#custom-conflict-handler",children:"revisions"}),"."]}),"\n",(0,i.jsx)(n.li,{children:"Store partial merges, track versions, or preserve multiple user edits."}),"\n",(0,i.jsx)(n.li,{children:"Fine-tune how your data merges to ensure consistency across distributed systems."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"4-reduced-cloud-costs",children:"4. Reduced Cloud Costs"}),"\n",(0,i.jsxs)(n.p,{children:["Firestore queries often count as billable reads. With RxDB, queries run ",(0,i.jsx)(n.strong,{children:"locally"})," against your local state - no repeated network calls or extra charges. You pay only for the data actually synced, not every read. For ",(0,i.jsx)(n.strong,{children:"read-heavy"})," apps, using RxDB as a Firestore alternative can significantly reduce costs."]}),"\n",(0,i.jsx)(n.h3,{id:"5-no-limits-on-query-features",children:"5. No Limits on Query Features"}),"\n",(0,i.jsx)(n.p,{children:"Firestore's query engine is limited by certain constraints (e.g., no advanced joins, limited indexing). With RxDB:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"NoSQL"})," data is stored locally, and you can define any indexes you need."]}),"\n",(0,i.jsxs)(n.li,{children:["Perform ",(0,i.jsx)(n.a,{href:"/rx-query.html",children:"complex queries"}),", run ",(0,i.jsx)(n.a,{href:"/fulltext-search.html",children:"full-text search"}),", or do aggregated transformations or even ",(0,i.jsx)(n.a,{href:"/articles/javascript-vector-database.html",children:"vector search"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Use ",(0,i.jsx)(n.a,{href:"/rx-query.html#observe",children:"RxDB's reactivity"})," to subscribe to query results in real time."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"6-true-offline-start-support",children:"6. True Offline-Start Support"}),"\n",(0,i.jsxs)(n.p,{children:["While Firestore does have offline caching, it often requires an online check at app initialization for authentication. RxDB is ",(0,i.jsx)(n.a,{href:"/offline-first.html",children:"truly offline-first"}),"; you can launch the app and write data even if the device never goes online initially. It's ready whenever the user is."]}),"\n",(0,i.jsx)(n.h3,{id:"7-cross-platform-any-javascript-runtime",children:"7. Cross-Platform: Any JavaScript Runtime"}),"\n",(0,i.jsxs)(n.p,{children:["RxDB is designed to run in ",(0,i.jsx)(n.strong,{children:"any environment"})," that can execute JavaScript. Whether you\u2019re building a web app in the browser, an ",(0,i.jsx)(n.a,{href:"/electron-database.html",children:"Electron"})," desktop application, a ",(0,i.jsx)(n.a,{href:"/react-native-database.html",children:"React Native"})," mobile app, or a command-line tool with ",(0,i.jsx)(n.a,{href:"/nodejs-database.html",children:"Node.js"}),", RxDB\u2019s storage layer is swappable to fit your runtime\u2019s capabilities."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["In the ",(0,i.jsx)(n.strong,{children:"browser"}),", store data in ",(0,i.jsx)(n.a,{href:"/rx-storage-indexeddb.html",children:"IndexedDB"})," or ",(0,i.jsx)(n.a,{href:"/rx-storage-opfs.html",children:"OPFS"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["In ",(0,i.jsx)(n.a,{href:"/nodejs-database.html",children:"Node.js"}),", use LevelDB or other supported storages."]}),"\n",(0,i.jsxs)(n.li,{children:["In ",(0,i.jsx)(n.a,{href:"/react-native-database.html",children:"React Native"}),", pick from a range of adapters suited for mobile devices."]}),"\n",(0,i.jsxs)(n.li,{children:["In ",(0,i.jsx)(n.a,{href:"/electron-database.html",children:"Electron"}),", rely on fast local storage with zero changes to your application code."]}),"\n"]}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h2,{id:"how-does-rxdbs-sync-work",children:"How Does RxDB's Sync Work?"}),"\n",(0,i.jsxs)(n.p,{children:["RxDB replication is powered by its ",(0,i.jsx)(n.a,{href:"/replication.html",children:"Replication Protocol"}),". This simple yet robust protocol enables:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Pull"}),": Fetch new or updated documents from the server."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Push"}),": Send local changes back to the server."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Live Real-Time"}),": Once you're caught up, you can opt for event-based streaming instead of continuous polling."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Code Example: Sync RxDB with a Custom Backend"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import { createRxDatabase } from 'rxdb/plugins/core';\nimport { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';\nimport { replicateRxCollection } from 'rxdb/plugins/replication';\n\nasync function initDB() {\n  const db = await createRxDatabase({\n    name: 'mydb',\n    storage: getRxStorageDexie(),\n    multiInstance: true,\n    eventReduce: true\n  });\n\n  await db.addCollections({\n    tasks: {\n      schema: {\n        title: 'task schema',\n        version: 0,\n        type: 'object',\n        primaryKey: 'id',\n        properties: {\n          id: { type: 'string', maxLength: 100 },\n          title: { type: 'string' },\n          done: { type: 'boolean' }\n        }\n      }\n    }\n  });\n\n  // Start a custom REST-based replication\n  replicateRxCollection({\n    collection: db.tasks,\n    replicationIdentifier: 'my-tasks-rest-api',\n    push: {\n      handler: async (documents) => {\n        // Send docs to your REST endpoint\n        const res = await fetch('https://myapi.com/push', {\n          method: 'POST',\n          body: JSON.stringify({ docs: documents })\n        });\n        // Return conflicts if any\n        return await res.json();\n      }\n    },\n    pull: {\n      handler: async (lastCheckpoint, batchSize) => {\n        // Fetch from your REST endpoint\n        const res = await fetch(`https://myapi.com/pull?checkpoint=${JSON.stringify(lastCheckpoint)}&limit=${batchSize}`);\n        return await res.json();\n      }\n    },\n    live: true // keep watching for changes\n  });\n\n  return db;\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["By swapping out the handler implementations or using an official plugin (e.g., ",(0,i.jsx)(n.a,{href:"/replication-graphql.html",children:"GraphQL"}),", ",(0,i.jsx)(n.a,{href:"/replication-couchdb.html",children:"CouchDB"}),", ",(0,i.jsx)(n.a,{href:"/replication-firestore.html",children:"Firestore replication"}),", etc.), you can adapt to any backend or data source. RxDB thus becomes a flexible alternative to Firestore while maintaining ",(0,i.jsx)(n.a,{href:"/articles/realtime-database.html",children:"real-time capabilities"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"getting-started-with-rxdb-as-a-firestore-alternative",children:"Getting Started with RxDB as a Firestore Alternative"}),"\n",(0,i.jsx)(n.h3,{id:"install-rxdb",children:"Install RxDB:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm install rxdb rxjs\n"})}),"\n",(0,i.jsx)(n.h3,{id:"create-a-database",children:"Create a Database:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import { createRxDatabase } from 'rxdb/plugins/core';\nimport { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';\n\nconst db = await createRxDatabase({\n  name: 'mydb',\n  storage: getRxStorageDexie()\n});\n"})}),"\n",(0,i.jsx)(n.h3,{id:"define-collections",children:"Define Collections:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"await db.addCollections({\n  items: {\n    schema: {\n      title: 'items schema',\n      version: 0,\n      primaryKey: 'id',\n      type: 'object',\n      properties: {\n        id: { type: 'string', maxLength: 100 },\n        text: { type: 'string' }\n      }\n    }\n  }\n});\n"})}),"\n",(0,i.jsx)(n.h3,{id:"sync",children:"Sync"}),"\n",(0,i.jsxs)(n.p,{children:["Use a ",(0,i.jsx)(n.a,{href:"/replication.html",children:"Replication Plugin"})," to connect with a custom backend or existing database."]}),"\n",(0,i.jsxs)(n.p,{children:["For a Firestore-specific approach, RxDB ",(0,i.jsx)(n.a,{href:"/replication-firestore.html",children:"Firestore Replication"})," also exists if you want to combine local indexing and advanced queries with a Cloud Firestore backend. But if you really want to replace Firestore entirely - just point RxDB to your new backend."]}),"\n",(0,i.jsx)(n.h3,{id:"example-start-a-webrtc-p2p-replication",children:"Example: Start a WebRTC P2P Replication"}),"\n",(0,i.jsxs)(n.p,{children:["In addition to syncing with a central server, RxDB also supports pure peer-to-peer replication using ",(0,i.jsx)(n.a,{href:"/replication-webrtc.html",children:"WebRTC"}),". This can be invaluable for scenarios where clients need to sync data directly without a master server."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import {\n  replicateWebRTC,\n  getConnectionHandlerSimplePeer\n} from 'rxdb/plugins/replication-webrtc';\n\nconst replicationPool = await replicateWebRTC({\n  collection: db.tasks,\n  topic: 'my-p2p-room', // Clients with the same topic will sync with each other.\n  connectionHandlerCreator: getConnectionHandlerSimplePeer({\n    // Use your own or the official RxDB signaling server\n    signalingServerUrl: 'wss://signaling.rxdb.info/',\n\n    // Node.js requires a polyfill for WebRTC & WebSocket\n    wrtc: require('node-datachannel/polyfill'),\n    webSocketConstructor: require('ws').WebSocket\n  }),\n  pull: {}, // optional pull config\n  push: {}  // optional push config\n});\n\n// The replicationPool manages all connected peers\nreplicationPool.error$.subscribe(err => {\n  console.error('P2P Sync Error:', err);\n});\n"})}),"\n",(0,i.jsxs)(n.p,{children:["This example sets up a live ",(0,i.jsx)(n.strong,{children:"P2P replication"})," where any new peers joining the same topic automatically sync local data with each other, eliminating the need for a dedicated central server for the actual data exchange."]}),"\n",(0,i.jsx)(n.h2,{id:"is-rxdb-right-for-your-project",children:"Is RxDB Right for Your Project?"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"You want offline-first"}),": If you need an offline-first app that starts offline, RxDB's local database approach and sync protocol excel at this."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Your project is read-heavy"}),": Reading from Firestore for every query can get expensive. With RxDB, reads are free and local; you only pay for writes or sync overhead."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"You need advanced queries"}),": Firestore's query constraints may not suit complex data. With RxDB, you can define your own indexing logic or run arbitrary queries locally."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"You want no vendor lock-in"}),": Easily transition from Firestore to your own server or another vendor - just change the replication layer."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"follow-up",children:"Follow Up"}),"\n",(0,i.jsx)(n.p,{children:"If you've been searching for a Firestore alternative that gives you the freedom to sync your data with any backend, offers robust offline-first capabilities, and supports truly customizable conflict resolution and queries, RxDB is worth exploring. You can adopt it seamlessly, ensure local reads, reduce costs, and stay in complete control of your data layer."}),"\n",(0,i.jsx)(n.p,{children:"Ready to dive in? Check out the RxDB Quickstart Guide, join our Discord community, and experience how RxDB can be the perfect local-first, real-time database solution for your next project."}),"\n",(0,i.jsx)(n.p,{children:"More resources:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/replication.html",children:"Replication Protocol"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/replication-firestore.html",children:"Firestore Replication Plugin"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/transactions-conflicts-revisions.html",children:"Custom Conflict Resolution"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/code/",children:"RxDB GitHub Repository"})}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>o});var r=t(6540);const i={},a=r.createContext(i);function s(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);