import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { Post, Like, Share, Unlike } from '../../../../types';

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
    },
    updatePost(state, action: PayloadAction<Post>) {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = {
          ...action.payload,
          createdAt: new Date(action.payload.createdAt).toISOString(),
          updatedAt: new Date(action.payload.updatedAt).toISOString()
        };
      }
    },
    deletePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    likePostSuccess(state, action: PayloadAction<{ postId: string; like: Like }>) {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.likes.push(action.payload.like);
      }
    },
    unlikePostSuccess(state, action: PayloadAction<{ postId: string; unlike: Unlike }>) {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.unlikes.push(action.payload.unlike);
      }
    },
    sharePostSuccess(state, action: PayloadAction<{ postId: string; share: Share }>) {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.shares.push(action.payload.share);
      }
    },
    repostPostSuccess(state, action: PayloadAction<{ postId: string; userId: string }>) {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.reposters.push(action.payload.userId);
        post.repostCount++;
      }
    }
  }
});

export const { fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure, addPost, updatePost, deletePost, likePostSuccess, unlikePostSuccess, sharePostSuccess, repostPostSuccess } = postSlice.actions;

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
