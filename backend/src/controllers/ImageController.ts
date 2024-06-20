import { Request, Response } from "express";
import axios from "axios";
import User from "../models/User";

const IMAGE_SERVER_URL = "http://localhost:7000/server-image";

export const addImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { imageName, imageBase64 } = req.body;

  try {
    const response = await axios.post(`${IMAGE_SERVER_URL}/ajouter-image`, {
      nom: imageName,
      base64: imageBase64,
    });

    const imageUrl = response.data.link;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.images.push(imageUrl);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image", error });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  const { id, imageName } = req.params;

  try {
    await axios.delete(`${IMAGE_SERVER_URL}/delete-image/${imageName}`);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.images = user.images.filter((image) => !image.includes(imageName));
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting image", error });
  }
};

export const updateImage = async (req: Request, res: Response) => {
  const { id, imageName } = req.params;
  const { imageBase64 } = req.body;

  try {
    const response = await axios.put(
      `${IMAGE_SERVER_URL}/update-image/${imageName}`,
      {
        base64: imageBase64,
      }
    );

    const imageUrl = response.data.link;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    console.error(error);
    res.status(500).json({ message: "Error updating image", error });
  }
};
