import { WebSocketMessage, User } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

let isCreatingUser = false;
let currentUserId: string | null = null;

export const handleUserMessage = (message: WebSocketMessage) => {
  const { type, payload } = message;

  switch (type) {
    case 'user.create.success':
      if (payload && typeof payload === 'object' && 'userId' in payload) {
        console.log('User created successfully:', payload.userId);
        currentUserId = payload.userId as string;
        isCreatingUser = false;
      }
      break;
    default:
      console.warn('Unhandled user message type:', type);
  }
};

export const createUser = (user: Pick<User, 'email' | 'firstName' | 'lastName'>): Promise<string> => {
  console.log('createUser called with:', user);
  return new Promise((resolve, reject) => {
    if (isCreatingUser) {
      reject(new Error('User creation already in progress'));
      return;
    }

    isCreatingUser = true;
    console.log('Sending user.create message');

    const message: WebSocketMessage = {
      type: 'user.create',
      payload: user
    };

    const handleUserCreateResult = (data: { userId: string }) => {
      console.log('Received user.create.success:', data);
      if (data.userId) {
        currentUserId = data.userId;
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

export const getCurrentUserId = (): string | null => {
  return currentUserId;
};
