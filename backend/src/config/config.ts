//config.ts

import dotenv from "dotenv";

dotenv.config();

export const config = {
  mongoURI:
    process.env.MONGO_URI || "mongodb://193.70.74.69:27017/recruteProject",
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  port: parseInt(process.env.PORT || "5000", 10),
};
