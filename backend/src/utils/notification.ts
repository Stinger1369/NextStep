// src/utils/notification.ts
import Notification from "../models/Notification";
import mongoose from "mongoose";

interface NotificationData {
  recipientId: string;
  senderId: string;
  type: string;
  message: string;
  link: string;
}

export const createNotification = async (data: NotificationData): Promise<void> => {
  const { recipientId, senderId, type, message, link } = data;

  const notification = new Notification({
    recipient: new mongoose.Types.ObjectId(recipientId),
    sender: new mongoose.Types.ObjectId(senderId),
    type,
    message,
    link
  });

  await notification.save();
};
