import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User from "../../models/User";
import { ERROR_CODES } from "../../constants/errorCodes";
import { config } from "../../config/config";

// Function to check if an error is of type AxiosError
function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}

// Interface for Axios error data
interface AxiosErrorData {
  error: string;
  code: string;
}

// Function to add a video
export const addVideo = async (req: Request, res: Response) => {
  const { id } = req.params; // User ID
  const { videoName, videoBase64 } = req.body;

  console.log(`Received request to add video for user ${id}`);
  console.log(`Video name: ${videoName}`);

  try {
    // Check if user exists
    const user = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      return res
        .status(404)
        .json({ message: "User not found", code: "USER_NOT_FOUND" });
    }

    // Filter out null or undefined videos
    user.videos = user.videos.filter(
      (vid) => vid !== null && vid !== undefined
    );

    console.log(`User ${id} currently has ${user.videos.length} videos`);

    // Check maximum number of videos
    if (user.videos.length >= config.maxVideosPerUser) {
      console.log(`User ${id} has reached the maximum number of videos`);
      return res.status(400).json({
        message: "You have reached the maximum number of videos allowed.",
        code: ERROR_CODES.ErrMaxVideosReached, // Utiliser le nouveau code d'erreur
      });
    }

    console.log(`Sending video to video server for processing`);

    // Send video to the video server for processing
    const response = await axios.post(
      `${config.videoServerURL}/ajouter-video`,
      {
        user_id: id,
        nom: videoName,
        base64: videoBase64,
      }
    );

    // Check errors returned by the video server
    if (response.data.error) {
      console.log(`Video rejected by video server: ${response.data.error}`);

      // If video is NSFW, return specific error code
      if (response.data.code === ERROR_CODES.ErrVideoNSFW) {
        return res.status(400).json({
          message: "Video is inappropriate (NSFW) and has been removed",
          code: ERROR_CODES.ErrVideoNSFW, // Utiliser le nouveau code d'erreur
        });
      }

      // Return other errors
      return res.status(400).json({
        message: response.data.error,
        code: response.data.code,
      });
    }

    // If the video server returns a complete URL, extract the relative path
    const relativeVideoPath = response.data.link.replace(
      `${config.videoServerURL}`,
      ""
    );
    console.log(
      `Relative video path received from video server: ${relativeVideoPath}`
    );

    // Check if the video already exists
    if (!user.videos.includes(relativeVideoPath)) {
      user.videos.push(relativeVideoPath);
      user.videos = Array.from(new Set(user.videos));

      // Save user changes
      await user.save();
      console.log(`Videos array after saving: ${JSON.stringify(user.videos)}`);

      console.log(
        `Video added successfully for user ${id}: ${relativeVideoPath}`
      );
      res
        .status(200)
        .json({ message: "Video added successfully", videos: user.videos });
    } else {
      console.log(`Video already exists for user ${id}: ${relativeVideoPath}`);
      return res.status(400).json({
        message: "This video already exists.",
        code: ERROR_CODES.ErrVideoAlreadyExists, // Utiliser le nouveau code d'erreur
      });
    }
  } catch (error) {
    console.error(`Caught an error: ${error}`);

    // Handle Axios errors
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      const errorData = error.response.data as AxiosErrorData;
      const errorMessage = errorData.error || "Error uploading video";
      console.error(`Error uploading video: ${errorMessage}`);
      return res.status(400).json({
        message: errorMessage,
        code: errorData.code,
      });
    }

    // Handle other errors
    console.error(`Unhandled error: ${(error as Error).message}`);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
      error: (error as Error).message,
      code: "UNKNOWN_ERROR",
    });
  }
};
