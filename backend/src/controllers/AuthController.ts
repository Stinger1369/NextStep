// src/controllers/AuthController.ts
import { Request, Response } from "express";
import User from "../models/User";
import {
  hashPassword,
  verifyPassword,
  generateToken,
} from "../utils/authUtils";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Utilisez le service de votre choix
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Vérification de votre adresse email",
    text: `Votre code de vérification est : ${code}`,
  };

  return transporter.sendMail(mailOptions);
};

export const register = async (req: Request, res: Response) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res
      .status(400)
      .json({ message: "Email or phone and password are required" });
  }

  try {
    const existingUser = await User.findOne({ emailOrPhone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const verificationCode = crypto.randomBytes(4).toString("hex"); // Générer un code de vérification de 8 caractères

    const user = new User({
      emailOrPhone,
      password: hashedPassword,
      images: [],
      videos: [],
      verificationCode,
      isVerified: false,
    });

    await user.save();
    await sendVerificationEmail(emailOrPhone, verificationCode); // Envoyer l'email de vérification

    res
      .status(201)
      .json({
        message:
          "User registered. Please check your email for verification code.",
      });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { emailOrPhone, code } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });

    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Error verifying email", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res
      .status(400)
      .json({ message: "Email or phone and password are required" });
  }

  try {
    const user = await User.findOne({
      $or: [{ emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};
