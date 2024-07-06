import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { fetchConversationsStart, fetchConversationsSuccess, fetchConversationsFailure } from '../conversationSlice';

export const fetchConversations = createAsyncThunk('conversation/fetchConversations', async (_, { dispatch, getState }) => {
  const state = getState() as RootState;
  const apiKey = state.auth.apiKey; // Récupérer l'API key de l'état auth
  dispatch(fetchConversationsStart());

  try {
    const socket = new WebSocket('ws://localhost:8080/ws');
    socket.onopen = () => {
      socket.send(JSON.stringify({ action: 'fetchConversations', apiKey }));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'fetchConversationsSuccess') {
        dispatch(fetchConversationsSuccess(data.conversations));
      } else {
        dispatch(fetchConversationsFailure(data.message));
      }
    };
    socket.onerror = (event) => {
      dispatch(fetchConversationsFailure('WebSocket error'));
    };
  } catch (error) {
    if (error instanceof Error) {
      dispatch(fetchConversationsFailure(error.message));
    } else {
      dispatch(fetchConversationsFailure('Unknown error'));
    }
  }
});
