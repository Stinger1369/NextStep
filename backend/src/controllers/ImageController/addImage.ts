import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User from "../../models/User";
import { ERROR_CODES } from "../../constants/errorCodes";
import { config } from "../../config/config";

// Définir une fonction de type AxiosError
function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}

// Interface pour les données d'erreur Axios
interface AxiosErrorData {
  error: string;
  code: string;
}

// Fonction pour ajouter une image
export const addImage = async (req: Request, res: Response) => {
  const { id } = req.params; // ID de l'utilisateur
  const { imageName, imageBase64 } = req.body;

  console.log(`Received request to add image for user ${id}`);
  console.log(`Image name: ${imageName}`);

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      return res
        .status(404)
        .json({ message: "User not found", code: "USER_NOT_FOUND" });
    }

    // Filtrer les images nulles ou indéfinies
    user.images = user.images.filter(
      (img) => img !== null && img !== undefined
    );

    console.log(`User ${id} currently has ${user.images.length} images`);

    // Vérifier le nombre maximum d'images
    if (user.images.length >= config.maxImagesPerUser) {
      console.log(`User ${id} has reached the maximum number of images`);
      return res.status(400).json({
        message: "You have reached the maximum number of images allowed.",
        code: ERROR_CODES.ErrMaxImagesReached,
      });
    }

    console.log(`Sending image to image server for processing`);

    // Envoyer l'image au serveur d'images pour traitement
    const response = await axios.post(
      `${config.imageServerURL}/ajouter-image`,
      {
        user_id: id,
        nom: imageName,
        base64: imageBase64,
      }
    );

    // Vérifier les erreurs renvoyées par le serveur d'images
    if (response.data.error) {
      console.info(`Image rejected by image server: ${response.data.error}`);

      // Si l'image est NSFW, renvoyer un code d'erreur spécifique sans déclencher une "Bad Request"
      if (response.data.code === ERROR_CODES.ErrImageNSFW) {
        return res.status(200).json({
          message: "Image is inappropriate (NSFW) and has been removed",
          code: ERROR_CODES.ErrImageNSFW,
        });
      }

      // Renvoyer d'autres erreurs
      return res.status(400).json({
        message: response.data.error,
        code: response.data.code,
      });
    }

    // Si le serveur d'images renvoie une URL complète, extraire le chemin relatif
    const relativeImagePath = response.data.link.replace(
      `${config.imageServerURL}`,
      ""
    );
    console.log(
      `Relative image path received from image server: ${relativeImagePath}`
    );

    // Vérifier si l'image existe déjà
    if (!user.images.includes(relativeImagePath)) {
      user.images.push(relativeImagePath);
      user.images = Array.from(new Set(user.images));

      // Enregistrer les modifications de l'utilisateur
      await user.save();
      console.log(`Images array after saving: ${JSON.stringify(user.images)}`);

      console.log(
        `Image added successfully for user ${id}: ${relativeImagePath}`
      );
      res
        .status(200)
        .json({ message: "Image added successfully", images: user.images });
    } else {
      console.log(`Image already exists for user ${id}: ${relativeImagePath}`);
      return res.status(400).json({
        message: "This image already exists.",
        code: ERROR_CODES.ErrImageAlreadyExists,
      });
    }
  } catch (error) {
    // Gérer les erreurs Axios
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      const errorData = error.response.data as AxiosErrorData;
      const errorMessage = errorData.error || "Error uploading image";
      if (errorData.code === ERROR_CODES.ErrImageNSFW) {
        console.info(`NSFW image error handled: ${errorMessage}`);
      } else {
        console.warn(`Error uploading image: ${errorMessage}`);
      }
      return res.status(400).json({
        message: errorMessage,
        code: errorData.code,
      });
    }

    // Gérer les autres erreurs
    console.error(`Unhandled error: ${(error as Error).message}`);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
      error: (error as Error).message,
      code: ERROR_CODES.UNKNOWN_ERROR,
    });
  }
};
