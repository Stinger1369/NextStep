// src/validators/imageValidators.ts
import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation middleware for addImage
export const validateAddImage = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("imageName").isString().withMessage("Image name must be a string"),
  body("imageBase64").isString().withMessage("Image base64 must be a string"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation middleware for deleteImage and updateImage
export const validateImageParams = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  param("imageName").isString().withMessage("Image name must be a string"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
