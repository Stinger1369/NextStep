import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Middleware for validating video addition
export const validateAddVideo = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("videoName").isString().withMessage("Video name must be a string"),
  body("videoBase64").isString().withMessage("Video base64 must be a string"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for validating video parameters
export const validateVideoParams = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  param("videoName").isString().withMessage("Video name must be a string"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
