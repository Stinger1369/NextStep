// src/socket/socket.ts
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import mongoose from "mongoose";
import Chat from "../models/Chat";
import Message from "../models/Message";
import { createNotification } from "../utils/notification";

interface MessageData {
  chatId: string;
  senderId: string;
  content: string;
}

export const initializeSocket = (server: HttpServer): void => {
  const io = new SocketIOServer(server);

  io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    socket.on("joinChat", async (chatId: string) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    socket.on("sendMessage", async (data: unknown) => {
      if (isMessageData(data)) {
        const { chatId, senderId, content } = data;
        const message = new Message({
          sender: new mongoose.Types.ObjectId(senderId),
          content,
          chat: new mongoose.Types.ObjectId(chatId),
        });
        await message.save();

        const chat = await Chat.findById(chatId);
        if (chat) {
          chat.messages.push(message._id as mongoose.Types.ObjectId);
          await chat.save();

          // Notify all participants in the chat except the sender
          chat.participants.forEach((participant) => {
            if (participant.toString() !== senderId) {
              createNotification({
                recipientId: participant.toString(),
                senderId,
                type: "new_message",
                message: "You have a new message",
                link: `/chats/${chatId}`,
              });
            }
          });
        }

        io.to(chatId).emit("newMessage", message);
      } else {
        console.error("Invalid message data received");
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

function isMessageData(data: any): data is MessageData {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.chatId === "string" &&
    typeof data.senderId === "string" &&
    typeof data.content === "string"
  );
}
