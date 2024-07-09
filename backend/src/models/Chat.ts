import mongoose, { Document, Schema, Types } from "mongoose";

interface IChat extends Document {
  participants: Types.ObjectId[];
  isGroupChat: boolean;
  chatName?: string;
  messages: Types.ObjectId[];
}

const ChatSchema: Schema = new Schema({
  participants: [{ type: Types.ObjectId, ref: "User", required: true }],
  isGroupChat: { type: Boolean, required: true },
  chatName: { type: String },
  messages: [{ type: Types.ObjectId, ref: "Message" }],
});

export default mongoose.model<IChat>("Chat", ChatSchema);
