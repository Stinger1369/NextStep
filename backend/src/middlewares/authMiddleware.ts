// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getSession } from "../utils/sessionUtils";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("Authorization header is missing");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "defaultSecret"
    );
    const sessionId = (decoded as any).id;

    // Check if the session exists in Redis
    const session = await getSession(sessionId);
    if (!session) {
      console.log(`Session not found in Redis for user ID: ${sessionId}`);
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.log("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
