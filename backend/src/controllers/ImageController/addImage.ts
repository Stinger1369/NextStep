import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User from "../../models/User";
import { ERROR_CODES } from "../../constants/errorCodes";

const IMAGE_SERVER_URL = "http://localhost:7000/server-image";
const MAX_IMAGES_PER_USER = 5;

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}

interface AxiosErrorData {
  error: string;
  code: string;
}

export const addImage = async (req: Request, res: Response) => {
  const { id } = req.params; // User ID
  const { imageName, imageBase64 } = req.body;

  console.log(`Received request to add image for user ${id}`);
  console.log(`Image name: ${imageName}`);

  try {
    const user = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.images = user.images.filter(
      (img) => img !== null && img !== undefined
    );

    console.log(`User ${id} currently has ${user.images.length} images`);

    if (user.images.length >= MAX_IMAGES_PER_USER) {
      console.log(`User ${id} has reached the maximum number of images`);
      return res.status(400).json({
        message: ERROR_CODES.ErrMaxImagesReached,
        code: ERROR_CODES.ErrMaxImagesReached,
      });
    }

    console.log(`Sending image to image server for processing`);
    const response = await axios.post(`${IMAGE_SERVER_URL}/ajouter-image`, {
      user_id: id,
      nom: imageName,
      base64: imageBase64,
    });

    if (response.data.error) {
      console.log(`Image rejected by image server: ${response.data.error}`);
      return res.status(400).json({
        message: response.data.error,
        code: response.data.code,
      });
    }

    const imageUrl = response.data.link;
    console.log(`Image URL received from image server: ${imageUrl}`);

    if (!user.images.includes(imageUrl)) {
      user.images.push(imageUrl);
      user.images = Array.from(new Set(user.images));

      await user.save();
      console.log(`Images array after saving: ${JSON.stringify(user.images)}`);

      console.log(`Image added successfully for user ${id}: ${imageUrl}`);
      res.status(200).json(user);
    } else {
      console.log(`Image already exists for user ${id}: ${imageUrl}`);
      return res.status(400).json({
        message: ERROR_CODES.ErrImageAlreadyExists,
        code: ERROR_CODES.ErrImageAlreadyExists,
      });
    }
  } catch (error) {
    console.error(`Caught an error: ${error}`);

    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      const errorData = error.response.data as AxiosErrorData;
      const errorMessage = errorData.error || "Error uploading image";
      console.error(`Error uploading image: ${errorMessage}`);
      return res.status(400).json({
        message: errorMessage,
        code: errorData.code,
      });
    }
    console.error(`Unhandled error: ${(error as Error).message}`);
    res.status(500).json({
      message: "UNKNOWN_ERROR",
      error: (error as Error).message,
      code: "UNKNOWN_ERROR",
    });
  }
};
