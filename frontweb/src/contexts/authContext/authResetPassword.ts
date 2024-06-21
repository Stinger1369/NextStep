// src/contexts/authContext/authResetPassword.ts
import axiosInstance from "../../axiosConfig";

export const resetPassword = async (
  emailOrPhone: string,
  code: string,
  newPassword: string
) => {
  await axiosInstance.post("/auth/reset-password", {
    emailOrPhone,
    code,
    newPassword,
  });
};
