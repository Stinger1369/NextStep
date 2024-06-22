import { Server } from "socket.io";

class SocketService {
  public io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      // Gestion de la déconnexion
      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });

      // Gestion des messages de groupe
      socket.on("groupMessage", (message) => {
        console.log("Received group message:", message);
        this.io.emit("groupMessage", message);
      });

      // Gestion des messages privés
      socket.on("privateMessage", ({ recipientId, message }) => {
        console.log(
          `Received private message: ${message} for user ${recipientId}`
        );
        socket.to(recipientId).emit("privateMessage", {
          senderId: socket.id,
          message: message,
        });
      });

      // Rejoindre une salle pour les messages privés
      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      // Quitter une salle
      socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
      });
    });
  }

  public sendMessage(event: string, message: any) {
    this.io.emit(event, message);
  }
}

export default SocketService;
