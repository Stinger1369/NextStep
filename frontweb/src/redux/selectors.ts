import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectPostsWithDates = createSelector(
  (state: RootState) => state.posts.posts,
  (posts) =>
    posts.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    }))
);

export const selectCommentsWithDatesByPostId = createSelector(
  [(state: RootState) => state.comments.comments, (_, postId: string) => postId],
  (comments, postId) =>
    comments
      .filter((comment) => comment.postId === postId)
      .map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt)
      }))
);
