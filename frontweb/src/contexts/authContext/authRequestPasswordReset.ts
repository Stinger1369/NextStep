// src/contexts/authContext/authRequestPasswordReset.ts
import axiosInstance from "../../axiosConfig";

export const requestPasswordReset = async (emailOrPhone: string) => {
  await axiosInstance.post("/auth/request-password-reset", {
    emailOrPhone,
  });
};
