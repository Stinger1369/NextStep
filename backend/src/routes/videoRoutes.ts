import { Router } from "express";
import {
  addVideo,
  deleteVideo,
  updateVideo,
  getVideo,
} from "../controllers/VideoController/VideoController";
import authMiddleware from "../middlewares/authMiddleware";
import {
  validateAddVideo,
  validateVideoParams,
} from "../validators/videoValidators";

const router = Router();

router.post("/user/:id/video", authMiddleware, validateAddVideo, addVideo);
router.delete(
  "/user/:id/video/:videoName",
  authMiddleware,
  validateVideoParams,
  deleteVideo
);
router.put(
  "/user/:id/video/:videoName",
  authMiddleware,
  validateVideoParams,
  updateVideo
);
router.get(
  "/user/:id/video/:videoName",
  authMiddleware,
  validateVideoParams,
  getVideo
);

export default router;
