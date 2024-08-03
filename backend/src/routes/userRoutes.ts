// routes/userRoutes.ts

import { Router } from "express";
import {
  getUsers,
  getUserByIdOrSlug,
  updateUser,
  deleteUser,
} from "../controllers/UserController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.get("/:id", getUserByIdOrSlug);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
