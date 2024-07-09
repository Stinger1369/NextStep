import { createAsyncThunk } from '@reduxjs/toolkit';
import { webSocketService } from '../../../../websocket/websocket';
import { ApiError, Post } from '../../../../types';

const extractJsonFromMessage = (message: string): string | null => {
  const jsonStartIndex = message.indexOf('{');
  if (jsonStartIndex !== -1) {
    const jsonString = message.substring(jsonStartIndex);
    try {
      JSON.parse(jsonString);
      return jsonString;
    } catch (e) {
      console.error('Error parsing JSON part of the message:', e);
    }
  }
  return null;
};

export const fetchUserPosts = createAsyncThunk('userSocket/fetchUserPosts', async ({ userId, apiKey }: { userId: string; apiKey: string }, { rejectWithValue }) => {
  return new Promise<Post[]>((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      const jsonString = extractJsonFromMessage(event.data);
      if (jsonString) {
        try {
          const data = JSON.parse(jsonString);
          if (data.action === 'fetchUserPosts') {
            resolve(data.posts);
          } else {
            reject(data.error || { message: 'Unexpected action or failure' });
          }
        } catch (error) {
          reject({ message: 'Invalid JSON response' } as ApiError);
        }
      } else {
        reject({ message: 'Invalid JSON response' } as ApiError);
      }
    };

    webSocketService.connect('ws://localhost:8080/ws', handleMessage);

    const fetchPostsData = {
      action: 'fetchUserPosts',
      data: { userId: userId },
      apiKey: apiKey // Utilise la clé API spécifique à l'utilisateur ici
    };

    webSocketService.sendWhenOpen(JSON.stringify(fetchPostsData));
  }).catch((error: ApiError) => {
    return rejectWithValue(error);
  });
});
