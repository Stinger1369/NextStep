import mongoose, { Document, Schema } from "mongoose";

interface IInteraction extends Document {
  user: mongoose.Schema.Types.ObjectId;
  type: "like" | "dislike";
  target: mongoose.Schema.Types.ObjectId;
  targetType: "Activity" | "User" | "Job";
  createdAt: Date;
}

const InteractionSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["like", "dislike"], required: true },
  target: { type: Schema.Types.ObjectId, required: true },
  targetType: {
    type: String,
    enum: ["Activity", "User", "Job"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IInteraction>("Interaction", InteractionSchema);
