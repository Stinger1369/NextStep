// src/redux/features/websocket/posts/postSlice.ts
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { Post } from '../../../../types';

interface SerializedPost extends Omit<Post, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface PostState {
  posts: SerializedPost[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchPostsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess(state, action: PayloadAction<Post[]>) {
      state.loading = false;
      state.posts = action.payload.map((post) => ({
        ...post,
        createdAt: new Date(post.createdAt).toISOString(),
        updatedAt: new Date(post.updatedAt).toISOString()
      }));
      console.log('Posts in fetchPostsSuccess:', state.posts);
    },
    fetchPostsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift({
        ...action.payload,
        createdAt: new Date(action.payload.createdAt).toISOString(),
        updatedAt: new Date(action.payload.updatedAt).toISOString()
      });
      console.log('Post added:', action.payload);
    }
  }
});

export const { fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure, addPost } = postSlice.actions;

export default postSlice.reducer;

export const selectPostsWithDates = createSelector(
  (state: RootState) => state.posts.posts,
  (posts) =>
    posts.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    }))
);
