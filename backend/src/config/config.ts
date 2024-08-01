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
  redisURL: process.env.REDIS_URL || "redis://redis:6379",
  imageServerURL:
    process.env.IMAGE_SERVER_URL || `http://${process.env.SERVER_DOMAIN}:7000`,
  maxImagesPerUser: parseInt(process.env.MAX_IMAGES_PER_USER || "5", 10),
  serverDomain: process.env.SERVER_DOMAIN || "localhost",
};
