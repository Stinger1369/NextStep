// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultSecret"
    );
    (req as any).user = decoded; // Adding user to the request object
    next();
  } catch (error) {
    console.log("JWT verification error:", error); // Log for JWT verification errors
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
