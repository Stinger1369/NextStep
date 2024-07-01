import http from "http";
import { initializeSocket } from "./socket/socket";
import { config } from "./config/config";
import initMongo from "./config/mongo";
import app from "./app";
import detect from 'detect-port';

// Initialiser MongoDB
initMongo();

const DEFAULT_PORT = parseInt(process.env.PORT || config.port.toString(), 10);

const startServer = async (port: number) => {
  const server = http.createServer(app);

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
  });

  // Initialiser Socket.IO
  initializeSocket(server);
};

detect(DEFAULT_PORT)
  .then((port: number) => {
    if (port === DEFAULT_PORT) {
      console.log(`Attempting to start server on port ${DEFAULT_PORT}`);
      startServer(DEFAULT_PORT);
    } else {
      console.log(`Port ${DEFAULT_PORT} is in use, switching to port ${port}`);
      startServer(port);
    }
  })
  .catch((err: Error) => {
    console.error(`Error detecting port: ${err.message}`);
  });
