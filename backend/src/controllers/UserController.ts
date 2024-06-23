import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des utilisateurs",
        error,
      });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Récupération de l'utilisateur par ID :", id); // Log pour vérifier l'ID

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("Utilisateur non trouvé :", id); // Log pour vérifier si l'utilisateur n'est pas trouvé
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Erreur lors de la récupération de l'utilisateur :", error); // Log pour vérifier les erreurs
    res
      .status(500)
      .json({
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
    bio,
    experience,
    education,
    skills,
    images,
    videos,
    sex,
    dateOfBirth,
    showAge,
  } = req.body;

  try {
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
      ...(images && { images }),
      ...(videos && { videos }),
      ...(sex && { sex }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(age !== undefined && { age }),
      ...(showAge !== undefined && { showAge }),
    };

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      upsert: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
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
    res
      .status(500)
      .json({
        message: "Erreur lors de la suppression de l'utilisateur",
        error,
      });
  }
};
