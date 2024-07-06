// src/redux/features/SocketServer/commentSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../../../types';

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    fetchCommentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.loading = false;
      state.comments = action.payload;
    },
    fetchCommentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchCommentsStart, fetchCommentsSuccess, fetchCommentsFailure } = commentSlice.actions;
export default commentSlice.reducer;
