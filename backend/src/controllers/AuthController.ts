// src/controllers/AuthController.ts
import { Request, Response } from "express";
import User from "../models/User";
import {
  hashPassword,
  verifyPassword,
  generateToken,
} from "../utils/authUtils";

export const register = async (req: Request, res: Response) => {
  const { emailOrPhone, password } = req.body;

  console.log("Register request body:", req.body); // Log pour vérifier le corps de la requête

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

    const user = new User({
      emailOrPhone,
      password: hashedPassword,
      images: [],
      videos: [],
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Register error:", error); // Log pour vérifier les erreurs d'enregistrement
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { emailOrPhone, password } = req.body;

  console.log("Login request body:", req.body); // Log pour vérifier le corps de la requête

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

    if (typeof user.password !== "string") {
      return res
        .status(500)
        .json({ message: "Password is not a valid string" });
    }

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error); // Log pour vérifier les erreurs de connexion
    res.status(500).json({ message: "Error logging in", error });
  }
};
