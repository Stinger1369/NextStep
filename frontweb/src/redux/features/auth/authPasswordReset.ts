import { AppDispatch } from '../../store';
import { requestPasswordReset, resetPassword } from './authSlice';

export const performRequestPasswordReset =
  (emailOrPhone: string) => async (dispatch: AppDispatch) => {
    try {
      await dispatch(requestPasswordReset(emailOrPhone)).unwrap();
    } catch (error) {
      console.error('Request password reset error:', error);
    }
  };

export const performResetPassword =
  (emailOrPhone: string, code: string, newPassword: string) => async (dispatch: AppDispatch) => {
    try {
      await dispatch(resetPassword({ emailOrPhone, code, newPassword })).unwrap();
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };
