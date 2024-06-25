import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User from "../../models/User";

const IMAGE_SERVER_URL = "http://localhost:7000/server-image";
const MAX_IMAGES_PER_USER = 5;

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

    if (user.images.length >= MAX_IMAGES_PER_USER) {
      console.log(`User ${id} has reached the maximum number of images`);
      return res
        .status(400)
        .json({ message: "You have reached the maximum number of images" });
    }

    const response = await axios.post(`${IMAGE_SERVER_URL}/ajouter-image`, {
      user_id: id,
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

    if (!user.images.includes(imageUrl)) {
      user.images.push(imageUrl);
      user.images = Array.from(new Set(user.images));

      await user.save();
      console.log(`Images array after saving: ${JSON.stringify(user.images)}`);

      console.log(`Image added successfully for user ${id}: ${imageUrl}`);
      res.status(200).json(user);
    } else {
      console.log(`Image already exists for user ${id}: ${imageUrl}`);
      res.status(400).json({ message: "Image already exists" });
    }
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
