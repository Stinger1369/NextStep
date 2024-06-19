import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload"; // Importer le middleware de gestion des fichiers
import userRoutes from "./routes/userRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import authRoutes from "./routes/authRoutes";
import authMiddleware from "./middlewares/authMiddleware";
import initMongo from "./config/mongo";
import { config } from "./config/config";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000" })); // Configurer CORS pour permettre les requêtes de localhost:3000

app.use(express.json());
app.use(fileUpload()); // Utiliser le middleware de gestion des fichiers
app.use(express.static("uploads")); // Servir les fichiers statiques du dossier 'uploads'

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/jobs", authMiddleware, jobRoutes);
app.use("/api/applications", authMiddleware, applicationRoutes);

initMongo();

console.log(`MongoDB URI: ${config.mongoURI}`);
console.log(`JWT Secret: ${config.jwtSecret}`);
console.log(`Server Port: ${config.port}`);

export default app;
