// src/routes/imageRoutes.ts
import { Router } from "express";
import {
  addImage,
  deleteImage,
  updateImage,
} from "../controllers/ImageController";
import authMiddleware from "../middlewares/authMiddleware";
import {
  validateAddImage,
  validateImageParams,
} from "../validators/imageValidators";

const router = Router();

router.post("/user/:id/image", authMiddleware, validateAddImage, addImage);
router.delete(
  "/user/:id/image/:imageName",
  authMiddleware,
  validateImageParams,
  deleteImage
);
router.put(
  "/user/:id/image/:imageName",
  authMiddleware,
  validateImageParams,
  updateImage
);

export default router;
