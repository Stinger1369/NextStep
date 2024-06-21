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
    { id: user._id, email: user.emailOrPhone, userType: user.userType },
    process.env.JWT_SECRET || "defaultSecret",
    { expiresIn: "1h" }
  );
};
