import mongoose, { Document, Schema } from "mongoose";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
  phone: string;
  dateOfBirth: Date;
  age?: number;
  address: Address;
  profession?: string;
  company?: string;
  bio?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  images: string[];
  videos: string[];
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number }, // Calculé automatiquement
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  profession: { type: String },
  company: { type: String },
  bio: { type: String },
  experience: { type: String },
  education: { type: String },
  skills: [{ type: String }],
  images: [{ type: String }],
  videos: [{ type: String }],
});

// Méthode pour calculer l'âge
UserSchema.pre<IUser>("save", function (next) {
  const now = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  this.age = age;
  next();
});

export default mongoose.model<IUser>("User", UserSchema);
