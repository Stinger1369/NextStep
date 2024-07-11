import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  images: string[];
}

const userSchema = new Schema({
  email: { type: String, required: true },
  images: { type: [String], default: [] },
});

const User = model<IUser>("User", userSchema);
export default User;
export { IUser };
