// src/controllers/image/updateImage.ts
import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../../models/User";

const IMAGE_SERVER_URL = "http://57.129.31.50:7000/server-image";

export const updateImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, imageName } = req.params;
  const { imageBase64 } = req.body;

  try {
    const response = await axios.put(
      `${IMAGE_SERVER_URL}/update-image/${id}/${imageName}`,
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
