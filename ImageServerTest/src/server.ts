import express from "express";
import mongoose from "mongoose";
import imageRoutes from "./routes/imageRoutes";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/api/images", imageRoutes);

mongoose
  .connect("mongodb://localhost:27017/yourdbname")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
