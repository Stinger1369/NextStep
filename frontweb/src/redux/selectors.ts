// src/redux/selectors.ts
import { createSelector } from 'reselect';
import { RootState } from './store';

const selectPosts = (state: RootState) => state.posts.posts;
const selectComments = (state: RootState) => state.comments.comments;

export const selectPostsWithDates = createSelector([selectPosts], (posts) =>
  posts.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt)
  }))
);

export const selectCommentsWithDates = createSelector([selectComments], (comments) =>
  comments.map((comment) => ({
    ...comment,
    createdAt: new Date(comment.createdAt),
    updatedAt: new Date(comment.updatedAt)
  }))
);
