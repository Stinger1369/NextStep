// src/controllers/ImageController/updateImage.ts

import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../../models/User";
import { config } from "../../config/config";

interface AxiosErrorData {
  message: string;
  code: string;
}

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}

export const updateImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, imageName } = req.params;
  const { imageBase64 } = req.body;

  try {
    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the image index
    const imageIndex = user.images.findIndex((image) =>
      image.includes(imageName)
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the old image
    const filename = imageName.split("/").pop(); // Correctly extract the filename
    if (filename) {
      const imageServerURL = `${config.imageServerURL}/delete-image/${id}/${filename}`;
      try {
        await axios.delete(imageServerURL);
        console.log(`Successfully deleted image: ${filename}`);
      } catch (deleteError) {
        console.error(`Failed to delete image: ${filename}`, deleteError);
        return res.status(500).json({
          message: "Failed to delete old image",
          error: (deleteError as Error).message,
        });
      }
    }

    // Add new cropped image
    const newImageName = `cropped-${Date.now()}-${filename}`; // Generate a new unique name
    const response = await axios.post(
      `${config.imageServerURL}/ajouter-image`,
      {
        user_id: id,
        nom: newImageName,
        base64: imageBase64,
      }
    );

    if (response.data.error) {
      console.log(`Image rejected by image server: ${response.data.error}`);
      return res.status(400).json({
        message: response.data.error,
        code: response.data.code,
      });
    }

    // Get the new image URL
    const imageUrl = response.data.link;

    // Update the user document
    user.images[imageIndex] = imageUrl; // Replace old image URL with new one

    await user.save();

    return res.status(200).json({ oldImage: imageName, newImage: imageUrl });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Axios error: ${error.message}`, error);
      if (error.response) {
        const errorData = error.response.data as AxiosErrorData;
        return res.status(error.response.status).json({
          message: errorData.message || "Error updating image",
          error: errorData,
        });
      }
    }
    console.error(`Unhandled error: ${(error as Error).message}`, error);
    return res.status(500).json({
      message: "Error updating image",
      error: (error as Error).message,
    });
  }
};
