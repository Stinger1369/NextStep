// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getSession } from "../utils/sessionUtils";
import User, { IUser } from "../models/User";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
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
    ) as { id: string };
    const sessionId = decoded.id;

    const session = await getSession(sessionId);
    if (!session) {
      console.log(`Session not found in Redis for user ID: ${sessionId}`);
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    const user = await User.findById(sessionId).populate("companies");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
