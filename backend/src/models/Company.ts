import mongoose, { Document, Schema } from "mongoose";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ICompany extends Document {
  companyName: string;
  companyRegistrationNumber: string;
  address: Address;
  numberOfEmployees: number;
  industryType: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  description?: string;
  foundedDate?: Date;
  logo?: string;
  socialMediaLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  companySize?: "small" | "medium" | "large";
  headquarterLocation?: string;
  subsidiaries?: string[];
  certifications?: string[];
}

const CompanySchema: Schema = new Schema({
  companyName: { type: String, required: true },
  companyRegistrationNumber: { type: String, required: true, unique: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  numberOfEmployees: { type: Number, required: true },
  industryType: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  website: { type: String },
  description: { type: String },
  foundedDate: { type: Date },
  logo: { type: String },
  socialMediaLinks: {
    linkedin: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
  },
  companySize: { type: String, enum: ["small", "medium", "large"] },
  headquarterLocation: { type: String },
  subsidiaries: [{ type: String }],
  certifications: [{ type: String }],
});

export default mongoose.model<ICompany>("Company", CompanySchema);
