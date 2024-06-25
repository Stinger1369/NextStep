import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../../models/User";

const IMAGE_SERVER_URL = "http://localhost:7000/server-image";
const MAX_IMAGES_PER_USER = 5;


export const deleteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, imageName } = req.params;

  try {
    await axios.delete(`${IMAGE_SERVER_URL}/delete-image/${id}/${imageName}`);

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