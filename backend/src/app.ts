import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/userRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import authRoutes from "./routes/authRoutes";
import imageRoutes from "./routes/imageRoutes";
import authMiddleware from "./middlewares/authMiddleware";
import { config } from "./config/config";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  })
);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/jobs", authMiddleware, jobRoutes);
app.use("/api/applications", authMiddleware, applicationRoutes);
app.use("/api/images", authMiddleware, imageRoutes);

export default app;
