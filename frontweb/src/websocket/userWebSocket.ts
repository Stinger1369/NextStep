// userWebSocket.ts
import { WebSocketMessage, User } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

let isCreatingUser = false;

export const handleUserMessage = (message: WebSocketMessage) => {
  const { type, payload } = message;

  switch (type) {
    case 'user.create.success':
      if (payload && typeof payload === 'object' && 'userId' in payload) {
        console.log('User created successfully:', payload.userId);
        isCreatingUser = false;
      }
      break;
    case 'user.check.result':
      console.log('User check result received:', payload);
      // Handled by the event listener in checkUserExistence
      break;
    default:
      console.warn('Unhandled user message type:', type);
  }
};

export const checkUserExistence = (email: string): Promise<boolean> => {
  console.log('checkUserExistence called with:', email);
  return new Promise((resolve) => {
    const message: WebSocketMessage = {
      type: 'user.check',
      payload: { email }
    };

    const handleUserCheckResult = (data: { exists: boolean }) => {
      console.log('checkUserExistence result:', data.exists);
      resolve(data.exists);
      removeEventListener('user.check.result', handleUserCheckResult);
    };

    addEventListener('user.check.result', handleUserCheckResult);
    sendMessage(message);
  });
};

export const createUser = (user: Pick<User, 'email' | 'firstName' | 'lastName'>): Promise<string> => {
  console.log('createUser called with:', user);
  return new Promise((resolve, reject) => {
    if (isCreatingUser) {
      reject(new Error('User creation already in progress'));
      return;
    }

    isCreatingUser = true;

    const message: WebSocketMessage = {
      type: 'user.create',
      payload: user
    };

    const handleUserCreateResult = (data: { userId: string }) => {
      if (data.userId) {
        resolve(data.userId);
      } else {
        reject(new Error('User creation failed'));
      }
      removeEventListener('user.create.success', handleUserCreateResult);
      isCreatingUser = false;
    };

    addEventListener('user.create.success', handleUserCreateResult);
    sendMessage(message);
  });
};
