import { createServer } from "http";
import SocketService from "./socketService";

const httpServer = createServer();
const ioServer = new SocketService(httpServer);

httpServer.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
