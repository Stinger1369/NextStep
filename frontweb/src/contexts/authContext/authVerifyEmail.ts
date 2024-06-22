// src/contexts/authContext/authVerifyEmail.ts
import axiosInstance from "../../axiosConfig";

export const verifyEmail = async (emailOrPhone: string, code: string) => {
  try {
    await axiosInstance.post("/auth/verify-email", { emailOrPhone, code });
  } catch (error) {
    console.error("Verify email error:", error);
  }
};
