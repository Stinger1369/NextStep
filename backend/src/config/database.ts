// src/config/database.ts
import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true); // Option de configuration globale
    await mongoose.connect(config.mongoURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;
