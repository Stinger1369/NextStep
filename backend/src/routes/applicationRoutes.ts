// src/routes/applicationRoutes.ts
import { Router } from "express";
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/ApplicationController";

const router = Router();

router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.put("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);

export default router;
