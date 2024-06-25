import { Router } from "express";
import {
  addImage,
  addImages,
  deleteImage,
  updateImage,
} from "../controllers/ImageController/ImageController";
import authMiddleware from "../middlewares/authMiddleware";
import {
  validateAddImage,
  validateAddImages, // Import the new validation for multiple images
  validateImageParams,
} from "../validators/imageValidators";

const router = Router();

router.post("/user/:id/image", authMiddleware, validateAddImage, addImage);
router.post("/user/:id/images", authMiddleware, validateAddImages, addImages); // New route for multiple images
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
