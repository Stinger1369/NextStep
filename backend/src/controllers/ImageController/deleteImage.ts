import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../../models/User";
import { config } from "../../config/config";
import { ERROR_CODES } from "../../constants/errorCodes";

// Interface for Axios error response
interface AxiosErrorResponseData {
  errorCode?: string;
  message?: string;
}

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

    const imageServerURL = `${config.imageServerURL}/delete-image/${id}/${filename}`;
    console.log(`Image server URL: ${imageServerURL}`);

    // Attempt to delete the image from the image server
    try {
      await axios.delete(imageServerURL);
      console.log(`Image ${filename} deleted from image server for user ${id}`);
    } catch (err) {
      const axiosErr = err as AxiosError<AxiosErrorResponseData>;

      // Check if the error is due to the file not being found
      if (
        axiosErr.response?.status === 500 &&
        axiosErr.response.data?.message?.includes("no such file or directory") // Use optional chaining
      ) {
        console.log(
          `File ${filename} not found on image server, skipping deletion`
        );
      } else {
        // If it's another type of error, throw it to handle it in the catch block below
        throw axiosErr;
      }
    }

    const user: IUser | null = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Remove the image from the user's image list
    user.images = user.images.filter((image) => !image.includes(filename));
    await user.save();

    console.log(`Image ${filename} removed from user ${id}'s images`);
    res.status(200).json(user);
  } catch (error) {
    const err = error as AxiosError<AxiosErrorResponseData>;
    console.error(`Error deleting image: ${err.message}`, err);

    res.status(500).json({
      message: "Error deleting image",
      error: err.message,
      details: err.response?.data,
    });
  }
};
