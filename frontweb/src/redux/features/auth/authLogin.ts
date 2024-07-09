// src/redux/features/auth/authLogin.ts
import axiosInstance from '../../../axiosConfig';
import { AppDispatch } from '../../store';
import { login } from './authSlice';
import { sendLoginInfo } from '../SocketServer/webSocketAuth';

export const performLogin = (emailOrPhone: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const resultAction = await dispatch(login({ emailOrPhone, password }));
    if (login.fulfilled.match(resultAction)) {
      const user = resultAction.payload.user;
      sendLoginInfo(user);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
