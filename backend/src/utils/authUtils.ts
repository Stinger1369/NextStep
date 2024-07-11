// src/utils/authUtils.ts
import argon2 from "argon2";
import jwt from "jsonwebtoken";

//backend\src\utils\authUtils.ts
export const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password);
};

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  return await argon2.verify(hashedPassword, plainPassword);
};

export const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, email: user.email, userType: user.userType },
    process.env.JWT_SECRET || "defaultSecret",
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, email: user.email, userType: user.userType },
    process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret",
    { expiresIn: "7d" } // Token de rafraîchissement valide pendant 7 jours
  );
};