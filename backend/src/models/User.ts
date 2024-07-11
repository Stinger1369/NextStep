import mongoose, { Document, Schema } from "mongoose";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface SocialMediaLinks {
  github?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  discord?: string;
}

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  userType: "employer" | "recruiter" | "jobSeeker";
  phone?: string;
  dateOfBirth?: Date;
  age?: number;
  showAge?: boolean;
  address?: Address;
  profession?: string;
  bio?: string;
  experience?: string[];
  education?: string[];
  skills?: string[];
  hobbies?: string[];
  images: string[];
  videos: string[];
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
  isVerified: boolean;
  resetPasswordCode?: string;
  resetPasswordExpiresAt?: Date;
  sex?: string; // 'male', 'female', or 'other'
  company?: string; // Pour les utilisateurs travaillant dans une seule entreprise
  companyId?: string; // Pour les utilisateurs travaillant dans une seule entreprise
  companies?: mongoose.Types.ObjectId[]; // Pour les utilisateurs gérant plusieurs entreprises
  socialMediaLinks?: SocialMediaLinks;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, index: true },
  lastName: { type: String, index: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["employer", "recruiter", "jobSeeker"],
  },
  phone: { type: String },
  dateOfBirth: { type: Date },
  age: { type: Number },
  showAge: { type: Boolean, default: false },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
  },
  profession: { type: String },
  bio: { type: String },
  experience: { type: [String], default: [] },
  education: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  hobbies: { type: [String], default: [] },
  images: { type: [String], default: [] },
  videos: { type: [String], default: [] },
  verificationCode: { type: String },
  verificationCodeExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },
  resetPasswordCode: { type: String },
  resetPasswordExpiresAt: { type: Date },
  sex: { type: String },
  company: { type: String }, // Pour les utilisateurs travaillant dans une seule entreprise
  companyId: { type: String }, // Pour les utilisateurs travaillant dans une seule entreprise
  companies: [{ type: Schema.Types.ObjectId, ref: "Company" }], // Pour les utilisateurs gérant plusieurs entreprises
  socialMediaLinks: {
    github: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    discord: { type: String },
  },
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
