import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User from "../../models/User";

const IMAGE_SERVER_URL = "http://localhost:7000/server-image";
const MAX_IMAGES_PER_USER = 5;

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
        message: `You can only upload ${MAX_IMAGES_PER_USER} images. Please delete some images before adding new ones.`,
      });
    }

    const uniqueImageUrls = new Set(user.images);

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
          continue;
        }

        const imageUrl = response.data.link;
        console.log(`Image URL received from image server: ${imageUrl}`);

        uniqueImageUrls.add(imageUrl);
      } catch (error) {
        console.error(`Error uploading image: ${error}`);
      }
    }

    user.images = Array.from(uniqueImageUrls).slice(0, MAX_IMAGES_PER_USER);

    await user.save();
    console.log(`Images array after saving: ${JSON.stringify(user.images)}`);

    console.log(`Images added successfully for user ${id}`);
    res.status(200).json(user);
  } catch (error) {
    const err = error as AxiosError;
    if (err.response && err.response.status === 400) {
      console.error(`Error uploading images: ${err.message}`, err);
      console.error(`Error response from image server: ${err.response.data}`);
      return res
        .status(400)
        .json({ message: (err.response.data as any).error });
    }
    console.error(`Error uploading images: ${err.message}`, err);
    res
      .status(500)
      .json({ message: "Error uploading images", error: err.message });
  }
};
