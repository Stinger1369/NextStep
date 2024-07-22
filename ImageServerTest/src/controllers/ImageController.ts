import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../models/User";

const IMAGE_SERVER_URL = "http://57.129.50.107:7000/server-image";
const MAX_IMAGES_PER_USER = 5;

export const addImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { imageName, imageBase64 } = req.body;

  console.log(`Received request to add image for user ${id}`);
  console.log(`Image name: ${imageName}`);

  try {
    const user = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.images.length >= MAX_IMAGES_PER_USER) {
      console.log(`User ${id} has reached the maximum number of images`);
      return res
        .status(400)
        .json({ message: "You have reached the maximum number of images" });
    }

    const response = await axios.post(`${IMAGE_SERVER_URL}/ajouter-image`, {
      nom: imageName,
      base64: imageBase64,
    });

    console.log(`Response from image server: ${JSON.stringify(response.data)}`);
    console.log(`Response status from image server: ${response.status}`);

    if (response.data.error) {
      console.log(`Image rejected by image server: ${response.data.error}`);
      return res.status(400).json({
        message: response.data.error,
      });
    }

    let imageUrl = response.data.link;
    console.log(`Image URL received from image server: ${imageUrl}`);

    // Ensure the URL uses forward slashes
    imageUrl = imageUrl.replace(/\\/g, "/");
    console.log(`Formatted Image URL: ${imageUrl}`);

    user.images.push(imageUrl);
    await user.save();

    console.log(`Image added successfully for user ${id}: ${imageUrl}`);
    res.status(200).json(user);
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

export const deleteImage = async (req: Request, res: Response) => {
  const { id, imageName } = req.params;

  try {
    const response = await axios.delete(
      `${IMAGE_SERVER_URL}/delete-image/${id}/${imageName}`
    );
    console.log(`Response from image server: ${JSON.stringify(response.data)}`);
    console.log(`Response status from image server: ${response.status}`);

    const user: IUser | null = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.images = user.images.filter((image) => !image.includes(imageName));
    await user.save();

    console.log(`Image deleted successfully for user ${id}: ${imageName}`);
    res.status(200).json(user);
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Error deleting image: ${err.message}`, err);
    console.error(`Error response from image server: ${err.response?.data}`);
    res
      .status(500)
      .json({ message: "Error deleting image", error: err.message });
  }
};

export const updateImage = async (req: Request, res: Response) => {
  const { id, imageName } = req.params;
  const { imageBase64 } = req.body;

  try {
    const response = await axios.put(
      `${IMAGE_SERVER_URL}/update-image/${id}/${imageName}`,
      {
        base64: imageBase64,
      }
    );

    console.log(`Response from image server: ${JSON.stringify(response.data)}`);
    console.log(`Response status from image server: ${response.status}`);

    if (response.data.error) {
      console.log(`Image rejected by image server: ${response.data.error}`);
      return res.status(400).json({ message: response.data.error });
    }

    const imageUrl = response.data.link;
    console.log(`Image URL received from image server: ${imageUrl}`);

    const user: IUser | null = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
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

    console.log(`Image updated successfully for user ${id}: ${imageUrl}`);
    res.status(200).json(user);
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Error updating image: ${err.message}`, err);
    console.error(`Error response from image server: ${err.response?.data}`);
    res
      .status(500)
      .json({ message: "Error updating image", error: err.message });
  }
};
