// src/redux/features/auth/authLogin.ts
import { AppDispatch } from '../../store';
import { login } from './authSlice';
import { sendCreateUser } from '../../../websocket/websocket';

export const performLogin = (emailOrPhone: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const resultAction = await dispatch(login({ emailOrPhone, password }));
    if (login.fulfilled.match(resultAction)) {
      const user = resultAction.payload.user;
      sendCreateUser(user); // Send WebSocket request to create user
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
