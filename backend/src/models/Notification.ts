// src/models/Notification.ts
import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  recipient: mongoose.Schema.Types.ObjectId;
  sender: mongoose.Schema.Types.ObjectId;
  type: string;
  message: string;
  read: boolean;
  link: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
