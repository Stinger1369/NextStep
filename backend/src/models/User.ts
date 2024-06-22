import mongoose, { Document, Schema } from "mongoose";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  emailOrPhone: string;
  password: string;
  userType?: string;
  phone?: string;
  dateOfBirth?: Date;
  age?: number;
  address?: Address;
  profession?: string;
  company?: string;
  bio?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  images: string[];
  videos: string[];
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
  isVerified: boolean;
  resetPasswordCode?: string;
  resetPasswordExpiresAt?: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  emailOrPhone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String },
  phone: { type: String },
  dateOfBirth: { type: Date },
  age: { type: Number },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
  },
  profession: { type: String },
  company: { type: String },
  bio: { type: String },
  experience: { type: String },
  education: { type: String },
  skills: [{ type: String }],
  images: [{ type: String }],
  videos: [{ type: String }],
  verificationCode: { type: String },
  verificationCodeExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },
  resetPasswordCode: { type: String },
  resetPasswordExpiresAt: { type: Date },
});

UserSchema.pre<IUser>("save", function (next) {
  if (this.dateOfBirth) {
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
  }
  next();
});

export default mongoose.model<IUser>("User", UserSchema);
