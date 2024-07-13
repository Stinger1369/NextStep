// src/redux/features/websocket/users/userWebsocketThunks/userWebsocketThunks.ts

import { AppDispatch } from '../../../../store';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from '../userWebSocketSlice';
import { getUserById } from '../../../../../websocket/userWebSocket';

export const fetchUser = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchUserRequest());
  try {
    const user = await getUserById(userId);
    dispatch(fetchUserSuccess(user));
  } catch (error) {
    if (error instanceof Error) {
      dispatch(fetchUserFailure(error.message));
    } else {
      dispatch(fetchUserFailure('An unknown error occurred'));
    }
  }
};
