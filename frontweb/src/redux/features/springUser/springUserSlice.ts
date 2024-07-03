import { createSlice } from '@reduxjs/toolkit';
import { getSpringUsers, getSpringUserById } from './springUserThunks';

const springUserSlice = createSlice({
  name: 'springUsers',
  initialState: {
    users: [],
    selectedUser: null,
    status: 'idle',
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSpringUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSpringUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(getSpringUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Unknown error';
      })
      .addCase(getSpringUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSpringUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedUser = action.payload;
      })
      .addCase(getSpringUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Unknown error';
      });
  }
});

export default springUserSlice.reducer;
