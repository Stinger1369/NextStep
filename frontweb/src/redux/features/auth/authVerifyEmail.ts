import { AppDispatch } from "../../store";
import { verifyEmail, resendVerificationCode } from "./authSlice";

export const performVerifyEmail =
  (emailOrPhone: string, code: string) => async (dispatch: AppDispatch) => {
    try {
      await dispatch(verifyEmail({ emailOrPhone, code })).unwrap();
    } catch (error) {
      console.error("Verify email error:", error);
    }
  };

export const performResendVerificationCode =
  (emailOrPhone: string) => async (dispatch: AppDispatch) => {
    try {
      await dispatch(resendVerificationCode(emailOrPhone)).unwrap();
    } catch (error) {
      console.error("Resend verification code error:", error);
    }
  };
