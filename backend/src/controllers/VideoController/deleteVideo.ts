import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import User, { IUser } from "../../models/User";
import { config } from "../../config/config";

export const deleteVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, videoName } = req.params;

  console.log(`Received request to delete video for user ${id}`);
  console.log(`Video name: ${videoName}`);

  try {
    // Extract the filename from the URL
    const filename = videoName.split("/").pop();
    if (!filename) {
      throw new Error("Invalid video name");
    }

    const videoServerURL = `${config.videoServerURL}/delete-video/${id}/${filename}`;
    console.log(`Video server URL: ${videoServerURL}`);

    await axios.delete(videoServerURL);
    console.log(`Video ${filename} deleted from video server for user ${id}`);

    const user: IUser | null = await User.findById(id);

    if (!user) {
      console.log(`User ${id} not found`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.videos = user.videos.filter((video) => !video.includes(filename));
    await user.save();

    console.log(`Video ${filename} removed from user ${id}'s videos`);
    res.status(200).json(user);
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Error deleting video: ${err.message}`, err);
    res.status(500).json({
      message: "Error deleting video",
      error: err.message,
      details: err.response?.data,
    });
  }
};
