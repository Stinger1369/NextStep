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

export const addImages = async (req: Request, res: Response) => {
  const { id } = req.params; // User ID
  const { images } = req.body;

  console.log(`Received request to add images for user ${id}`);
  console.log(`Number of images: ${images.length}`);

  try {
    const user = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.images = user.images.filter(
      (img) => img !== null && img !== undefined
    );

    const totalImages = user.images.length + images.length;
    if (totalImages > MAX_IMAGES_PER_USER) {
      console.log(`User ${id} has reached the maximum number of images`);
      return res.status(400).json({
        message: ERROR_CODES.ErrMaxImagesReached,
        code: ERROR_CODES.ErrMaxImagesReached,
      });
    }

    const uniqueImageUrls = new Set(user.images);
    const results = [];

    for (const img of images) {
      try {
        const response = await axios.post(`${IMAGE_SERVER_URL}/ajouter-image`, {
          user_id: id,
          nom: img.imageName,
          base64: img.imageBase64,
        });

        console.log(
          `Response from image server: ${JSON.stringify(response.data)}`
        );
        console.log(`Response status from image server: ${response.status}`);

        if (response.data.error) {
          console.log(`Image rejected by image server: ${response.data.error}`);
          results.push({
            imageName: img.imageName,
            status: "failed",
            message: response.data.error,
            code: response.data.code,
          });
          continue;
        }

        const imageUrl = response.data.link;
        console.log(`Image URL received from image server: ${imageUrl}`);

        uniqueImageUrls.add(imageUrl);
        results.push({
          imageName: img.imageName,
          status: "success",
          url: imageUrl,
        });
      } catch (error) {
        const err = error as AxiosError;
        if (isAxiosError(err) && err.response && err.response.status === 400) {
          const errorData = err.response.data as AxiosErrorData;
          const errorMessage = errorData.error || "Error uploading image";
          console.error(`Error uploading image: ${errorMessage}`);
          results.push({
            imageName: img.imageName,
            status: "failed",
            message: errorMessage,
            code: errorData.code,
          });
          continue;
        }
        console.error(`Error uploading image: ${err.message}`);
        results.push({
          imageName: img.imageName,
          status: "failed",
          message: err.message,
          code: "UNKNOWN_ERROR",
        });
      }
    }

    user.images = Array.from(uniqueImageUrls).slice(0, MAX_IMAGES_PER_USER);

    await user.save();
    console.log(`Images array after saving: ${JSON.stringify(user.images)}`);

    console.log(`Images added successfully for user ${id}`);
    res.status(200).json({ user, results });
  } catch (error) {
    const err = error as AxiosError;
    if (isAxiosError(err) && err.response && err.response.status === 400) {
      const errorData = err.response.data as AxiosErrorData;
      const errorMessage = errorData.error || "Error uploading images";
      console.error(`Error uploading images: ${errorMessage}`);
      return res.status(400).json({
        message: errorMessage,
        code: errorData.code,
      });
    }
    console.error(`Error uploading images: ${err.message}`);
    res.status(500).json({
      message: "Error uploading images",
      error: err.message,
      code: "UNKNOWN_ERROR",
    });
  }
};
