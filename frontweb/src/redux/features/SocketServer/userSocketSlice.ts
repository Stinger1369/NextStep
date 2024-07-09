// userSocketSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchUserDetails } from './Thunk/userSocketThunk';
import { fetchUserPosts } from './Thunk/postSockeThunk';
import { UserDetails, Post } from '../../../types';

interface UserState {
  details: UserDetails | null;
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  details: null,
  posts: [],
  loading: false,
  error: null
};

const userSocketSlice = createSlice({
  name: 'userSocket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
        state.posts = action.payload.posts; // Mise à jour des posts
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default userSocketSlice.reducer;
