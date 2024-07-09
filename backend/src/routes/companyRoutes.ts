// src/routes/companyRoutes.ts

import { Router } from "express";
import {
  createCompany,
  updateCompany,
  getCompanies,
  getCompanyById,
  deleteCompany,
} from "../controllers/CompanyController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getCompanies);
router.get("/:id", authMiddleware, getCompanyById);
router.post("/", authMiddleware, createCompany);
router.put("/:id", authMiddleware, updateCompany);
router.delete("/:id", authMiddleware, deleteCompany);

export default router;
