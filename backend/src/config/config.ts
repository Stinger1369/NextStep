import dotenv from "dotenv";

dotenv.config();

export const config = {
  mongoURI:
    process.env.MONGO_URI_Backend_NODE ||
    "mongodb://localhost:27017/recruteProject",
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret",
  port: parseInt(process.env.PORT || "5000", 10),
  emailUser: process.env.EMAIL_USER || "defaultEmailUser",
  emailPass: process.env.EMAIL_PASS || "defaultEmailPass",
  redisURL: process.env.REDIS_URL || "redis://localhost:6379",
  imageServerURL:
    process.env.IMAGE_SERVER_URL || "http://localhost:7000/server-image", // Use localhost directly
  maxImagesPerUser: parseInt(process.env.MAX_IMAGES_PER_USER || "5", 10),
};
