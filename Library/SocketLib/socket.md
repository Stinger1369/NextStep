Library
├── src
│   ├── index.ts
│   ├── socketService.ts
├── tests
│   ├── privateMessage.test.ts
│   ├── groupMessage.test.ts
├── client.ts
├── server.ts
├── package.json
├── tsconfig.json
└── jest.config.js

socket final
Library
├── dist
│   ├── client.js
│   ├── index.js
│   ├── socketService.js
├── src
│   ├── client.ts
│   ├── index.ts
│   ├── socketService.ts
│   ├── server.ts
├── package.json
├── tsconfig.json
├── README.md
└── jest.config.js


yarn install

Démarrer le serveur :
ts-node src/server.ts

Démarrer le client :
ts-node src/client.ts

Exécuter les tests :
yarn test
