mkdir -p microservice/imageService
cd microservice/imageService
npm init -y

npm install express axios dotenv
npm install --save-dev typescript ts-node @types/node @types/express nodemon

tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}

PS H:\NextStep\microservice\imageService> mkdir src
>> mkdir src\controllers
>> mkdir src\middlewares
>> mkdir src\routes
>> mkdir src\utils

New-Item -Path .\src\app.ts -ItemType File
New-Item -Path .\src\server.ts -ItemType File

npx tsc
node dist/server.js
