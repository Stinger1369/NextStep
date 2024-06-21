// src/contexts/authContext/authVerifyEmail.ts
import axiosInstance from "../../axiosConfig";

export const verifyEmail = async (emailOrPhone: string, code: string) => {
  try {
    const response = await axiosInstance.post("/auth/verify-email", {
      emailOrPhone,
      code,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};
