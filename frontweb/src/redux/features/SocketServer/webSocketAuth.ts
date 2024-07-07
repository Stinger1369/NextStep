import { webSocketService } from '../../../websocket/websocket';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError } from '../../../../src/types';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailOrPhone: string;
}

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

export const sendLoginInfo = (user: User) => {
  const handleMessage = (event: MessageEvent) => {
    const jsonString = extractJsonFromMessage(event.data);
    if (jsonString) {
      const data = JSON.parse(jsonString);
      console.log('Received from WebSocket:', data);
    } else {
      console.error('Invalid JSON received from WebSocket:', event.data);
    }
  };

  webSocketService.connect('ws://localhost:8080/ws', handleMessage);

  const loginData = {
    action: 'login',
    data: {
      userId: user._id,
      username: `${user.firstName} ${user.lastName}`,
      email: user.emailOrPhone
    }
  };

  console.log('Sending login data via WebSocket:', loginData);

  webSocketService.sendWhenOpen(JSON.stringify(loginData));
};

export const fetchApiKey = createAsyncThunk('auth/fetchApiKey', async (owner: string, { rejectWithValue }) => {
  return new Promise<string>((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      const jsonString = extractJsonFromMessage(event.data);
      if (jsonString) {
        try {
          const data = JSON.parse(jsonString);
          if (data.action === 'generateApiKey') {
            if (data.success) {
              resolve(data.apiKey);
            } else {
              reject(data.error);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          reject({ message: 'Invalid JSON response' } as ApiError);
        }
      } else {
        console.error('Invalid JSON received from WebSocket:', event.data);
        reject({ message: 'Invalid JSON response' } as ApiError);
      }
    };

    webSocketService.connect('ws://localhost:8080/ws', handleMessage);

    webSocketService.sendWhenOpen(JSON.stringify({ action: 'generateApiKey', data: { owner } }));
  }).catch((error: ApiError) => {
    return rejectWithValue(error);
  });
});
