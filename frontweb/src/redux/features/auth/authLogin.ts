import { AppDispatch } from '../../store';
import { login } from './authSlice';
import { sendCreateUser } from '../../../websocket/websocket';

export const performLogin = (emailOrPhone: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const resultAction = await dispatch(login({ emailOrPhone, password }));
    if (login.fulfilled.match(resultAction)) {
      const user = resultAction.payload.user;
      sendCreateUser({
        emailOrPhone: user.emailOrPhone,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
