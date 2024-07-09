import mongoose, { Document, Schema } from "mongoose";

interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  company: string;
  location: string;
  salary: number;
  recruiter: mongoose.Schema.Types.ObjectId;
  datePosted: Date;
  interactions: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String, required: true }],
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  datePosted: { type: Date, default: Date.now },
  interactions: [{ type: Schema.Types.ObjectId, ref: "Interaction" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

export default mongoose.model<IJob>("Job", JobSchema);
