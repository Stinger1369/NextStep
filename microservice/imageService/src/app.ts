// src/app.ts
import express from "express";
import imageRoutes from "./routes/imageRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Increase request body size limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", imageRoutes);

export default app;
