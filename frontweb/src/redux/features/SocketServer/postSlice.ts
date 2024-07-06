// src/redux/features/SocketServer/postSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../../types';

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.posts = action.payload;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    }
  }
});

export const { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure, addPost } = postSlice.actions;
export default postSlice.reducer;
