// src/redux/features/userWebSocket/userWebSocketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../../types';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
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
    }
  }
});

export const { createUserRequest, createUserSuccess, createUserFailure } = userWebSocketSlice.actions;

export default userWebSocketSlice.reducer;
