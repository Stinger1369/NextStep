import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { Comment } from '../../../../types';

interface SerializedComment extends Omit<Comment, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface CommentState {
  comments: SerializedComment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    fetchCommentsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess(state, action: PayloadAction<Comment[]>) {
      state.loading = false;
      state.comments = action.payload.map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt).toISOString(),
        updatedAt: new Date(comment.updatedAt).toISOString()
      }));
      console.log('Comments in fetchCommentsSuccess:', state.comments);
    },
    fetchCommentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addComment(state, action: PayloadAction<Comment>) {
      const exists = state.comments.some((comment) => comment.id === action.payload.id);
      if (!exists) {
        state.comments.unshift({
          ...action.payload,
          createdAt: new Date(action.payload.createdAt).toISOString(),
          updatedAt: new Date(action.payload.updatedAt).toISOString()
        });
        console.log('Comment added:', action.payload);
      } else {
        console.log('Comment already exists:', action.payload);
      }
    },
    updateComment(state, action: PayloadAction<Comment>) {
      const index = state.comments.findIndex((comment) => comment.id === action.payload.id);
      if (index !== -1) {
        state.comments[index] = {
          ...action.payload,
          createdAt: new Date(action.payload.createdAt).toISOString(),
          updatedAt: new Date(action.payload.updatedAt).toISOString()
        };
        console.log('Comment updated:', action.payload);
      }
    },
    deleteComment(state, action: PayloadAction<string>) {
      state.comments = state.comments.filter((comment) => comment.id !== action.payload);
      console.log('Comment deleted:', action.payload);
    }
  }
});

export const { fetchCommentsRequest, fetchCommentsSuccess, fetchCommentsFailure, addComment, updateComment, deleteComment } = commentSlice.actions;

export default commentSlice.reducer;

export const selectCommentsWithDatesByPostId = createSelector(
  (state: RootState) => state.comments.comments,
  (comments) => (postId: string) =>
    comments
      .filter((comment) => comment.postId === postId)
      .map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt)
      }))
);
