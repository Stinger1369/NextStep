import { webSocketService } from '../../../websocket/websocket';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError } from '../../../../src/types';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailOrPhone: string;
}

export const sendLoginInfo = (user: User) => {
  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log('Received from WebSocket:', data);
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

  // Envoie le message via WebSocket
  webSocketService.send(JSON.stringify(loginData));
};

export const fetchApiKey = createAsyncThunk('auth/fetchApiKey', async (owner: string, { rejectWithValue }) => {
  return new Promise<string>((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.action === 'generateApiKey') {
        if (data.success) {
          resolve(data.apiKey);
        } else {
          reject(data.error);
        }
      }
    };

    webSocketService.connect('ws://localhost:8080/ws', handleMessage);

    webSocketService.send(JSON.stringify({ action: 'generateApiKey', data: { owner } }));
  }).catch((error: ApiError) => {
    return rejectWithValue(error);
  });
});
