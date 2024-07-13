// src/redux/features/websocket/users/userWebsocketThunks/userWebsocketThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure, createUserRequest, createUserSuccess, createUserFailure, setCurrentUser } from '../userWebSocketSlice';
import { getUserById, createUser } from '../../../../../websocket/userWebSocket';

export const fetchUser = createAsyncThunk('user/fetchUser', async (userId: string, { dispatch }) => {
  dispatch(fetchUserRequest());
  try {
    const user = await getUserById(userId);
    dispatch(fetchUserSuccess(user));
    return user;
  } catch (error) {
    if (error instanceof Error) {
      dispatch(fetchUserFailure(error.message));
    } else {
      dispatch(fetchUserFailure('An unknown error occurred'));
    }
    throw error;
  }
});

export const createUserAndSetCurrent = createAsyncThunk('user/createAndSetCurrent', async (userData: { email: string; firstName: string; lastName: string }, { dispatch }) => {
  dispatch(createUserRequest());
  try {
    const user = await createUser(userData.email, userData.firstName, userData.lastName);
    dispatch(createUserSuccess(user));
    dispatch(setCurrentUser(user));
    return user;
  } catch (error) {
    if (error instanceof Error) {
      dispatch(createUserFailure(error.message));
    } else {
      dispatch(createUserFailure('An unknown error occurred'));
    }
    throw error;
  }
});
