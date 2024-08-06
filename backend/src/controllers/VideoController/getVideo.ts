import { Request, Response } from "express";
import User, { IUser } from "../../models/User";

export const getVideo = async (req: Request, res: Response) => {
  const { id, videoName } = req.params;

  try {
    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const video = user.videos.find((video) => video.includes(videoName));

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ video });
  } catch (error) {
    console.error(`Error fetching video: ${(error as Error).message}`, error);
    res.status(500).json({
      message: "Error fetching video",
      error: (error as Error).message,
    });
  }
};
