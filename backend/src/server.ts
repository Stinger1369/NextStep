import express from "express";
import http from "http";
import { initializeSocket } from "./socket/socket"; // Importer la configuration de Socket.IO
import { config } from "./config/config";
import initMongo from "./config/mongo";
import app from "./app"; // Assurez-vous que le fichier app.ts existe et configure Express

const server = http.createServer(app);
const PORT = config.port;

// Initialiser MongoDB
initMongo();

console.log(`Attempting to start server on port ${PORT}`);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialiser Socket.IO
initializeSocket(server);
