import { Request, Response } from "express";
import User from "../models/User";
import {
  hashPassword,
  verifyPassword,
  generateToken,
} from "../utils/authUtils";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../config/nodemailerConfig";

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
    const verificationCode = crypto.randomBytes(4).toString("hex");
    const verificationCodeExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now

    const user = new User({
      emailOrPhone,
      password: hashedPassword,
      images: [],
      videos: [],
      verificationCode,
      verificationCodeExpiresAt,
      isVerified: false,
    });

    await user.save();
    await sendVerificationEmail(emailOrPhone, verificationCode);

    res.status(201).json({
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

    if (
      user.verificationCodeExpiresAt &&
      user.verificationCodeExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
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
      return res.status(401).json({ message: "Email not verified" });
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

export const resendVerificationCode = async (req: Request, res: Response) => {
  const { emailOrPhone } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = crypto.randomBytes(4).toString("hex");
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now
    await user.save();
    await sendVerificationEmail(emailOrPhone, verificationCode);

    res.status(200).json({ message: "Verification code resent successfully" });
  } catch (error) {
    console.error("Resend verification code error:", error);
    res
      .status(500)
      .json({ message: "Error resending verification code", error });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { emailOrPhone } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetPasswordCode = crypto.randomBytes(4).toString("hex");
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now
    await user.save();
    await sendPasswordResetEmail(emailOrPhone, resetPasswordCode);

    res.status(200).json({ message: "Password reset code sent successfully" });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ message: "Error requesting password reset", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { emailOrPhone, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });

    if (!user || user.resetPasswordCode !== code) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (
      user.resetPasswordExpiresAt &&
      user.resetPasswordExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Error resetting password", error });
  }
};
