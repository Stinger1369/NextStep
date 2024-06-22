// src/server.ts
import http from "http";
import { initializeSocket } from "./socket/socket";
import { config } from "./config/config";
import initMongo from "./config/mongo";
import app from "./app";

// Initialiser MongoDB
initMongo();

const server = http.createServer(app);
const PORT = config.port;

console.log(`Attempting to start server on port ${PORT}`);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialiser Socket.IO
initializeSocket(server);
