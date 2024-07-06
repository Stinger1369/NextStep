import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { Post } from '../../../../types';
import { addPost, fetchPostsFailure } from '../postSlice';

export const createPost = createAsyncThunk<void, Post, { rejectValue: string }>('post/createPost', async (post: Post, { dispatch, getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const apiKey = state.auth.apiKey; // Récupérer l'API key de l'état auth

  try {
    const socket = new WebSocket('ws://localhost:8080/ws');
    socket.onopen = () => {
      socket.send(JSON.stringify({ action: 'createPost', apiKey, data: post }));
    };
    socket.onmessage = (event) => {
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
    };
    socket.onerror = () => {
      dispatch(fetchPostsFailure('WebSocket error'));
    };
  } catch (error) {
    return rejectWithValue('An unknown error occurred');
  }
});
