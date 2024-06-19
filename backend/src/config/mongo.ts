import mongoose from "mongoose";
import { config } from "./config";

const initMongo = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default initMongo;
