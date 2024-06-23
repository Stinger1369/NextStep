import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../models/User";

const IMAGE_SERVER_URL = "http://localhost:7000/server-image";

export const addImage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { imageName, imageBase64 } = req.body;

  console.log(`Received request to add image for user ${id}`);
  console.log(`Image name: ${imageName}`);

  try {
    const response = await axios.post(`${IMAGE_SERVER_URL}/ajouter-image`, {
      nom: imageName,
      base64: imageBase64,
    });

    console.log(`Response from image server: ${JSON.stringify(response.data)}`);

    if (response.data.error) {
      console.log(`Image rejected by image server: ${response.data.error}`);
      return res
        .status(400)
        .json({
          message:
            "Your image contains inappropriate content and has been rejected.",
        });
    }

    const imageUrl = response.data.link;
    const user: IUser | null = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.images.push(imageUrl);
    await user.save();

    console.log(`Image added successfully for user ${id}: ${imageUrl}`);
    res.status(200).json(user);
  } catch (error) {
    const err = error as AxiosError;
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
  const { id, imageName } = req.params;

  try {
    await axios.delete(`${IMAGE_SERVER_URL}/delete-image/${imageName}`);

    const user: IUser | null = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.images = user.images.filter((image) => !image.includes(imageName));
    await user.save();

    res.status(200).json(user);
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
  const { id, imageName } = req.params;
  const { imageBase64 } = req.body;

  try {
    const response = await axios.put(
      `${IMAGE_SERVER_URL}/update-image/${imageName}`,
      {
        base64: imageBase64,
      }
    );

    // Vérifiez si l'image a été rejetée par le serveur d'images
    if (response.status === 400 && response.data.error) {
      console.log(`Image rejected by image server: ${response.data.error}`);
      res.status(400).json({ message: response.data.error });
      return;
    }

    const imageUrl = response.data.link;
    const user: IUser | null = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const imageIndex = user.images.findIndex((image) =>
      image.includes(imageName)
    );
    if (imageIndex !== -1) {
      user.images[imageIndex] = imageUrl;
    } else {
      user.images.push(imageUrl);
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Error updating image: ${err.message}`, err);
    res
      .status(500)
      .json({ message: "Error updating image", error: err.message });
  }
};
