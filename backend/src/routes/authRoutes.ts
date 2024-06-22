// src/routes/authRoutes.ts
import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  requestPasswordReset,
  resetPassword,
  refreshToken,
} from "../controllers/AuthController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-code", resendVerificationCode);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);

export default router;
