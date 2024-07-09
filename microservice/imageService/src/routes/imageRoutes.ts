import { Router } from "express";
import {
  addImage,
  deleteImage,
  updateImage,
} from "../controllers/imageController";
import {
  validateAddImage,
  validateImageParams,
} from "../validators/imageValidators";

const router = Router();

router.post("/user/:userId/image", validateAddImage, addImage);
router.delete(
  "/user/:userId/image/:imageName",
  validateImageParams,
  deleteImage
);
router.put("/user/:userId/image/:imageName", validateImageParams, updateImage);

export default router;
