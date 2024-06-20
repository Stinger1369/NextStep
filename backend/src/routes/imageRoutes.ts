import { Router } from "express";
import {
  addImage,
  deleteImage,
  updateImage,
} from "../controllers/ImageController";

const router = Router();

router.post("/user/:id/image", addImage);
router.delete("/user/:id/image/:imageName", deleteImage);
router.put("/user/:id/image/:imageName", updateImage);

export default router;
