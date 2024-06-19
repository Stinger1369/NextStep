import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  target: mongoose.Schema.Types.ObjectId;
  targetType: "Activity" | "User" | "Job";
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  target: { type: Schema.Types.ObjectId, required: true },
  targetType: {
    type: String,
    enum: ["Activity", "User", "Job"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>("Comment", CommentSchema);
