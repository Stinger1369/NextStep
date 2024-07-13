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

const isValidDate = (date: string | Date): boolean => {
  return !isNaN(new Date(date).getTime());
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
        createdAt: isValidDate(comment.createdAt) ? new Date(comment.createdAt).toISOString() : 'Invalid Date',
        updatedAt: isValidDate(comment.updatedAt) ? new Date(comment.updatedAt).toISOString() : 'Invalid Date'
      }));
      console.log('Comments in fetchCommentsSuccess:', state.comments);
    },
    fetchCommentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.unshift({
        ...action.payload,
        createdAt: isValidDate(action.payload.createdAt) ? new Date(action.payload.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: isValidDate(action.payload.updatedAt) ? new Date(action.payload.updatedAt).toISOString() : new Date().toISOString()
      });
      console.log('Comment added:', action.payload);
    },
    updateComment(state, action: PayloadAction<Comment>) {
      const index = state.comments.findIndex((comment) => comment.id === action.payload.id);
      if (index !== -1) {
        state.comments[index] = {
          ...action.payload,
          createdAt: isValidDate(action.payload.createdAt) ? new Date(action.payload.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: isValidDate(action.payload.updatedAt) ? new Date(action.payload.updatedAt).toISOString() : new Date().toISOString()
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

export const selectCommentsWithDates = createSelector(
  (state: RootState) => state.comments.comments,
  (comments) =>
    comments.map((comment) => ({
      ...comment,
      createdAt: isValidDate(comment.createdAt) ? new Date(comment.createdAt) : 'Invalid Date',
      updatedAt: isValidDate(comment.updatedAt) ? new Date(comment.updatedAt) : 'Invalid Date'
    }))
);
