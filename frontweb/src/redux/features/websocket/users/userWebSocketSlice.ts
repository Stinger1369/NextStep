// src/redux/features/websocket/users/userWebSocketSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../../types';

interface UserState {
  currentUser: User | null;
  users: Record<string, User>;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  users: {},
  loading: false,
  error: null
};

const userWebSocketSlice = createSlice({
  name: 'userWebSocket',
  initialState,
  reducers: {
    createUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createUserSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.currentUser = action.payload;
    },
    createUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.users[action.payload._id] = action.payload;
    },
    fetchUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { createUserRequest, createUserSuccess, createUserFailure, fetchUserRequest, fetchUserSuccess, fetchUserFailure } = userWebSocketSlice.actions;

export default userWebSocketSlice.reducer;
