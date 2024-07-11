import { AppDispatch } from '../../store';
import { requestPasswordReset, resetPassword } from './authSlice';

export const performRequestPasswordReset = (email: string) => async (dispatch: AppDispatch) => {
  try {
    await dispatch(requestPasswordReset(email)).unwrap();
  } catch (error) {
    console.error('Request password reset error:', error);
  }
};

export const performResetPassword = (email: string, code: string, newPassword: string) => async (dispatch: AppDispatch) => {
  try {
    await dispatch(resetPassword({ email, code, newPassword })).unwrap();
  } catch (error) {
    console.error('Reset password error:', error);
  }
};
