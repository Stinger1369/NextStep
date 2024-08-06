import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../../models/User";
import { config } from "../../config/config";

interface AxiosErrorData {
  message: string;
  code: string;
}

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}

export const updateVideo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, videoName } = req.params;
  const { videoBase64 } = req.body;

  try {
    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the video index
    const videoIndex = user.videos.findIndex((video) =>
      video.includes(videoName)
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete the old video
    const filename = videoName.split("/").pop(); // Correctly extract the filename
    if (filename) {
      const videoServerURL = `${config.videoServerURL}/delete-video/${id}/${filename}`;
      try {
        await axios.delete(videoServerURL);
        console.log(`Successfully deleted video: ${filename}`);
      } catch (deleteError) {
        console.error(`Failed to delete video: ${filename}`, deleteError);
        return res.status(500).json({
          message: "Failed to delete old video",
          error: (deleteError as Error).message,
        });
      }
    }

    // Add new video
    const newVideoName = `updated-${Date.now()}-${filename}`; // Generate a new unique name
    const response = await axios.post(
      `${config.videoServerURL}/ajouter-video`,
      {
        user_id: id,
        nom: newVideoName,
        base64: videoBase64,
      }
    );

    if (response.data.error) {
      console.log(`Video rejected by video server: ${response.data.error}`);
      return res.status(400).json({
        message: response.data.error,
        code: response.data.code,
      });
    }

    // Get the new video URL
    const videoUrl = response.data.link;

    // Update the user document
    user.videos[videoIndex] = videoUrl; // Replace old video URL with new one

    await user.save();

    return res.status(200).json({ oldVideo: videoName, newVideo: videoUrl });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Axios error: ${error.message}`, error);
      if (error.response) {
        const errorData = error.response.data as AxiosErrorData;
        return res.status(error.response.status).json({
          message: errorData.message || "Error updating video",
          error: errorData,
        });
      }
    }
    console.error(`Unhandled error: ${(error as Error).message}`, error);
    return res.status(500).json({
      message: "Error updating video",
      error: (error as Error).message,
    });
  }
};
