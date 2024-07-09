// src/models/Application.ts
import mongoose, { Document, Schema } from "mongoose";

interface IApplication extends Document {
  job: mongoose.Schema.Types.ObjectId;
  jobSeeker: mongoose.Schema.Types.ObjectId;
  coverLetter: string;
  resume: string;
  dateApplied: Date;
  status: string;
}

const ApplicationSchema: Schema = new Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coverLetter: { type: String, required: true },
  resume: { type: String, required: true },
  dateApplied: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

export default mongoose.model<IApplication>("Application", ApplicationSchema);
