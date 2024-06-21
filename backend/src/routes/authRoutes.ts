// src/routes/authRoutes.ts
import { Router } from "express";
import { register, login, verifyEmail } from "../controllers/AuthController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail); // Ajouter cette route

export default router;
