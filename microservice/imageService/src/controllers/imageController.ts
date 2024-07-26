import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();

const IMAGE_SERVER_URL =
  process.env.IMAGE_SERVER_URL || "http://135.125.244.65:7000/server-image";

export const addImage = async (req: Request, res: Response) => {
  const { userId, imageName, imageBase64 } = req.body;

  console.log(`Received request to add image for user ${userId}`);
  console.log(`Image name: ${imageName}`);

  try {
    const response = await axios.post(`${IMAGE_SERVER_URL}/ajouter-image`, {
      nom: imageName,
      base64: imageBase64,
    });

    console.log(`Response from image server: ${JSON.stringify(response.data)}`);
    console.log(`Response status from image server: ${response.status}`);

    if (response.data.error) {
      console.log(`Image rejected by image server: ${response.data.error}`);
      return res.status(400).json({ message: response.data.error });
    }

    const imageUrl = response.data.link;
    console.log(`Image URL received from image server: ${imageUrl}`);

    res.status(200).json({ link: imageUrl });
  } catch (error) {
    const err = error as AxiosError;
    if (err.response && err.response.status === 400) {
      console.error(`Error uploading image: ${err.message}`, err);
      console.error(`Error response from image server: ${err.response.data}`);
      return res
        .status(400)
        .json({ message: (err.response.data as any).error });
    }
    console.error(`Error uploading image: ${err.message}`, err);
    res
      .status(500)
      .json({ message: "Error uploading image", error: err.message });
  }
};

export const deleteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, imageName } = req.params;

  try {
    await axios.delete(
      `${IMAGE_SERVER_URL}/delete-image/${userId}/${imageName}`
    );
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Error deleting image: ${err.message}`, err);
    res
      .status(500)
      .json({ message: "Error deleting image", error: err.message });
  }
};

export const updateImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, imageName } = req.params;
  const { imageBase64 } = req.body;

  try {
    const response = await axios.put(
      `${IMAGE_SERVER_URL}/update-image/${userId}/${imageName}`,
      {
        base64: imageBase64,
      }
    );

    if (response.status === 400 && response.data.error) {
      console.log(`Image rejected by image server: ${response.data.error}`);
      res.status(400).json({ message: response.data.error });
      return;
    }

    const imageUrl = response.data.link;
    res.status(200).json({ link: imageUrl });
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Error updating image: ${err.message}`, err);
    res
      .status(500)
      .json({ message: "Error updating image", error: err.message });
  }
};
