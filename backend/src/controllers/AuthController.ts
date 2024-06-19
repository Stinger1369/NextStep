import { Request, Response } from "express";
import User from "../models/User";
import {
  hashPassword,
  verifyPassword,
  generateToken,
} from "../utils/authUtils";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "uploads/";

export const register = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    userType,
    phone,
    dateOfBirth,
    address,
  } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      phone,
      dateOfBirth,
      address,
      images: [],
      videos: [],
    });

    // Sauvegarder les images
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      for (const image of images) {
        const imagePath = path.join(UPLOAD_DIR, image.name);
        fs.writeFileSync(imagePath, image.data);
        user.images.push(imagePath);
      }
    }

    // Sauvegarder les vidéos
    if (req.files && req.files.videos) {
      const videos = Array.isArray(req.files.videos)
        ? req.files.videos
        : [req.files.videos];
      for (const video of videos) {
        const videoPath = path.join(UPLOAD_DIR, video.name);
        fs.writeFileSync(videoPath, video.data);
        user.videos.push(videoPath);
      }
    }

    await user.save();

    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
