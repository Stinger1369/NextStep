// src/contexts/authContext/authResendVerificationCode.ts
import axiosInstance from "../../axiosConfig";

export const resendVerificationCode = async (emailOrPhone: string) => {
  await axiosInstance.post("/auth/resend-verification-code", {
    emailOrPhone,
  });
};
