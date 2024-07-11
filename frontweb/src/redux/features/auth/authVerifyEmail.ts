import { AppDispatch } from '../../store';
import { verifyEmail, resendVerificationCode } from './authSlice';

export const performVerifyEmail = (email: string, code: string) => async (dispatch: AppDispatch) => {
  try {
    await dispatch(verifyEmail({ email, code })).unwrap();
  } catch (error) {
    console.error('Verify email error:', error);
  }
};

export const performResendVerificationCode = (email: string) => async (dispatch: AppDispatch) => {
  try {
    await dispatch(resendVerificationCode(email)).unwrap();
  } catch (error) {
    console.error('Resend verification code error:', error);
  }
};
