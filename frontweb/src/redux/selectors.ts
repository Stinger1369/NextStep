import { createSelector } from 'reselect';
import { RootState } from './store';
import { Post } from '../types';

const selectPosts = (state: RootState) => state.posts.posts;

export const selectPostsWithDates = createSelector([selectPosts], (posts) =>
  posts.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt)
  }))
);
