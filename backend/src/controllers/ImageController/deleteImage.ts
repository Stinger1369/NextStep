// src/controllers/ImageController/deleteImage.ts
import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../../models/User";

const IMAGE_SERVER_URL = "http://localhost:7000/server-image";

export const deleteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, imageName } = req.params;

  console.log(`Received request to delete image for user ${id}`);
  console.log(`Image name: ${imageName}`);

  try {
    // Extract the filename from the URL
    const filename = imageName.split("/").pop();
    if (!filename) {
      throw new Error("Invalid image name");
    }

    await axios.delete(`${IMAGE_SERVER_URL}/delete-image/${id}/${filename}`);
    console.log(`Image ${filename} deleted from image server for user ${id}`);

    const user: IUser | null = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.images = user.images.filter((image) => !image.includes(filename));
    await user.save();

    console.log(`Image ${filename} removed from user ${id}'s images`);
    res.status(200).json(user);
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Error deleting image: ${err.message}`, err);
    res
      .status(500)
      .json({ message: "Error deleting image", error: err.message });
  }
};
