// src/controllers/UserController.ts
import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Fetching user by ID:", id); // Log pour vérifier l'ID

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found:", id); // Log pour vérifier si l'utilisateur n'est pas trouvé
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error fetching user:", error); // Log pour vérifier les erreurs
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    phone,
    address,
    profession,
    company,
    bio,
    experience,
    education,
    skills,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        phone,
        address,
        profession,
        company,
        bio,
        experience,
        education,
        skills,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
