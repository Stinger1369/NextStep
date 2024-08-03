// controllers/UserController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
      error,
    });
  }
};

export const getUserByIdOrSlug = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id);
    } else {
      user = await User.findOne({ slug: id });
    }

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error,
    });
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
    companyId,
    companies,
    bio,
    experience,
    education,
    skills,
    hobbies,
    images,
    videos,
    sex,
    dateOfBirth,
    showAge,
    socialMediaLinks,
    cardOrder, // New field
    cardSpans, // New field
    columnCount, // New field
  } = req.body;

  try {
    console.log("Received data:", req.body);

    let age;
    if (dateOfBirth) {
      const now = new Date();
      const birthDate = new Date(dateOfBirth);
      age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && now.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    }

    const updateData: any = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(profession && { profession }),
      ...(company && { company }),
      ...(companyId && { companyId }),
      ...(companies && { companies }),
      ...(bio && { bio }),
      ...(experience && {
        experience: Array.isArray(experience)
          ? experience
          : experience.split(",").map((exp: string) => exp.trim()),
      }),
      ...(education && {
        education: Array.isArray(education)
          ? education
          : education.split(",").map((edu: string) => edu.trim()),
      }),
      ...(skills && { skills }),
      ...(hobbies && { hobbies }),
      ...(images && { images }),
      ...(videos && { videos }),
      ...(sex && { sex }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(age !== undefined && { age }),
      ...(showAge !== undefined && { showAge }),
      ...(socialMediaLinks && { socialMediaLinks }),
      ...(cardOrder && { cardOrder }), // Handling card order
      ...(cardSpans && { cardSpans }), // Handling card spans
      ...(columnCount && { columnCount }), // Handling column count
    };

    // Update slug if first or last name changed
    if (firstName || lastName) {
      const user = await User.findById(id);
      if (user) {
        const newFirstName = firstName || user.firstName;
        const newLastName = lastName || user.lastName;
        updateData.slug = `${newFirstName.toLowerCase()}-${newLastName.toLowerCase()}`;
      }
    }

    console.log("Update data:", updateData);

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      upsert: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error,
    });
  }
};
