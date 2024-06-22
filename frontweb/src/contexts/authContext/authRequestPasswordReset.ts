// src/contexts/authContext/authRequestPasswordReset.ts
import axiosInstance from "../../axiosConfig";

export const requestPasswordReset = async (emailOrPhone: string) => {
  try {
    await axiosInstance.post("/auth/request-password-reset", { emailOrPhone });
  } catch (error) {
    console.error("Request password reset error:", error);
  }
};
