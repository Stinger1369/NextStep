// src/controllers/AuthController/AuthRegisterLogin.ts

import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  generateRefreshToken,
} from "../../utils/authUtils";
import crypto from "crypto";
import { createSession } from "../../utils/sessionUtils";
import NotificationService from "notiflib";
import { validateEmailDomain } from "email-domain-validator-bilel"; // Import de la bibliothèque

// Middleware de validation
const validateRegister = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim()
    .escape(),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim()
    .escape(),
];

const validateRefreshToken = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required")
    .trim()
    .escape(),
];

const notificationService = new NotificationService();

// Fonction pour enregistrer un utilisateur

export const register = [
  ...validateRegister,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log("Validation errors for register:", errors.array());
    if (!errors.isEmpty()) {
      console.log("Register validation failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Register validation passed");
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ message: "Email or phone and password are required" });
    }

    // Vérification du domaine de l'email
    if (!validateEmailDomain(email)) {
      console.log(`Invalid email domain: ${email}`);
      return res
        .status(400)
        .json({
          message:
            "Invalid email domain. We do not accept fake or temporary emails.",
        });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(
          `Registration failed: User already exists with ${email}`
        );
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const verificationCode = crypto.randomBytes(4).toString("hex");
      const verificationCodeExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now

      const user = new User({
        email,
        password: hashedPassword,
        images: [],
        videos: [],
        verificationCode,
        verificationCodeExpiresAt,
        isVerified: false,
      });

      await user.save();
      await notificationService.sendEmailNotification(
        email,
        "Email Verification",
        "verificationEmail",
        { verificationCode }
      );

      console.log(`User registered successfully: ${user._id}`);

      res.status(201).json({
        message:
          "User registered. Please check your email for verification code.",
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Error registering user", error });
    }
  },
];
// Fonction pour connecter un utilisateur
export const login = [
  ...validateLogin,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log("Validation errors for login:", errors.array());
    if (!errors.isEmpty()) {
      console.log("Login validation failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Login validation passed");
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ message: "Email or phone and password are required" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`Login failed: User not found with ${email}`);
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isVerified) {
        console.log(
          `Login failed: Email not verified for user ${email}`
        );
        return res.status(401).json({ message: "Email not verified" });
      }

      const isPasswordValid = await verifyPassword(user.password, password);
      if (!isPasswordValid) {
        console.log(
          `Login failed: Incorrect password for user ${email}`
        );
        return res.status(400).json({ message: "Incorrect password" });
      }

      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      // Créer une session dans Redis
      console.log(`Creating session in Redis for user: ${user._id}`);
      await createSession(
        (user._id as unknown as string).toString(),
        { refreshToken },
        7 * 24 * 60 * 60
      ); // 7 days

      console.log(`User logged in successfully: ${user._id}`);

      res.status(200).json({ token, refreshToken, user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in", error });
    }
  },
];

// Fonction pour rafraîchir un token
export const refreshToken = [
  ...validateRefreshToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log("Validation errors for refresh token:", errors.array());
    if (!errors.isEmpty()) {
      console.log("Refresh token validation failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Refresh token validation passed");
    const { refreshToken } = req.body;

    if (!refreshToken) {
      console.log("Missing refresh token");
      return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret"
      ) as JwtPayload;
      const user = await User.findById(decoded.id);

      if (!user) {
        console.log(
          `Refresh token failed: User not found with ID ${decoded.id}`
        );
        return res.status(404).json({ message: "User not found" });
      }

      const newToken = generateToken(user);
      const newRefreshToken = generateRefreshToken(user);

      // Stocker le nouveau refresh token dans Redis
      console.log(`Storing new refresh token in Redis for user: ${user._id}`);
      await createSession(
        (user._id as unknown as string).toString(),
        { refreshToken: newRefreshToken },
        7 * 24 * 60 * 60
      ); // 7 days

      console.log(`Token refreshed successfully for user: ${user._id}`);

      res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({ message: "Error refreshing token", error });
    }
  },
];
