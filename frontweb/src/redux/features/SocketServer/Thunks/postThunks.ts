import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { Post } from '../../../../types';
import { addPost, fetchPostsFailure } from '../postSlice';
import { webSocketService } from '../../../../websocket/websocket';

export const createPost = createAsyncThunk<void, Post, { rejectValue: string }>('post/createPost', async (post: Post, { dispatch, getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const apiKey = state.auth.apiKey;

  try {
    webSocketService.connect('ws://localhost:8080/ws', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.action === 'createPostSuccess') {
          dispatch(addPost(data.post));
        } else {
          dispatch(fetchPostsFailure(data.message));
        }
      } catch (error) {
        dispatch(fetchPostsFailure('Invalid response from server'));
      }
    });

    webSocketService.send(JSON.stringify({ action: 'createPost', apiKey, data: post }));
  } catch (error) {
    return rejectWithValue('An unknown error occurred');
  }
});
