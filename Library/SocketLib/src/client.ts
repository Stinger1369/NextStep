import { io as Client } from "socket.io-client";

const clientSocket = Client("http://localhost:3000");

clientSocket.on("connect", () => {
  const recipientId = clientSocket.id; // Utilisez l'ID du client lui-même comme destinataire
  const message = "Bonjour Privé"; // Message à envoyer

  console.log(`Client connecté avec l'ID : ${clientSocket.id}`);
  console.log(`Envoi du message privé à ${recipientId}: ${message}`);

  clientSocket.emit("privateMessage", {
    recipientId,
    message,
  });
});

clientSocket.on("privateMessage", ({ senderId, message }: any) => {
  console.log(`Message privé reçu de ${senderId}: ${message}`);
});

clientSocket.on("disconnect", () => {
  console.log("Client déconnecté.");
});
