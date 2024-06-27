// src/redux/features/auth/authLogin.ts
import axiosInstance from '../../../axiosConfig';
import { AppDispatch } from '../../store';
import { login } from './authSlice';

export const performLogin = (emailOrPhone: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    await dispatch(login({ emailOrPhone, password }));
  } catch (error) {
    console.error('Login error:', error);
  }
};
