// src/websocket/userWebSocket.ts

import { WebSocketMessage, User } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export function getCurrentUser(userId: string): Promise<User> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'user.getCurrent',
      payload: { userId }
    };

    const handleGetCurrentUserResult = (data: User) => {
      resolve(data);
      removeEventListener('user.getCurrent.success', handleGetCurrentUserResult);
    };

    const handleError = (error: unknown) => {
      reject(error);
      removeEventListener('error', handleError);
    };

    addEventListener('user.getCurrent.success', handleGetCurrentUserResult);
    addEventListener('error', handleError);

    sendMessage(message);
  });
}

export function createUser(email: string, firstName: string, lastName: string): Promise<{ userId: string }> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'user.create',
      payload: { email, firstName, lastName }
    };

    const handleUserCreateResult = (data: { userId: string }) => {
      if (data.userId) {
        resolve(data);
      } else {
        reject(new Error('User creation failed'));
      }
      removeEventListener('user.create.success', handleUserCreateResult);
    };

    addEventListener('user.create.success', handleUserCreateResult);
    sendMessage(message);
  });
}

export function getUserByEmail(email: string): Promise<User> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'user.getByEmail',
      payload: { email }
    };

    const handleGetUserResult = (data: User) => {
      resolve(data);
      removeEventListener('user.getByEmail.success', handleGetUserResult);
    };

    addEventListener('user.getByEmail.success', handleGetUserResult);
    sendMessage(message);
  });
}

export function getUserById(userId: string): Promise<User> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'user.getById',
      payload: { userId }
    };

    const handleGetUserResult = (data: User) => {
      resolve(data);
      removeEventListener('user.getById.success', handleGetUserResult);
    };

    const handleError = (error: unknown) => {
      reject(error);
      removeEventListener('error', handleError);
    };

    addEventListener('user.getById.success', handleGetUserResult);
    addEventListener('error', handleError);

    sendMessage(message);
  });
}

export function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'user.update',
      payload: { userId, ...userData }
    };

    const handleUpdateUserResult = (data: User) => {
      resolve(data);
      removeEventListener('user.update.success', handleUpdateUserResult);
    };

    addEventListener('user.update.success', handleUpdateUserResult);
    sendMessage(message);
  });
}

export function deleteUser(userId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'user.delete',
      payload: { userId }
    };

    const handleDeleteUserResult = (data: { success: boolean }) => {
      if (data.success) {
        resolve();
      } else {
        reject(new Error('Failed to delete user'));
      }
      removeEventListener('user.delete.success', handleDeleteUserResult);
    };

    addEventListener('user.delete.success', handleDeleteUserResult);
    sendMessage(message);
  });
}

export function checkUserExists(email: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'user.check',
      payload: { email }
    };

    const handleCheckUserResult = (data: { exists: boolean }) => {
      resolve(data.exists);
      removeEventListener('user.check.result', handleCheckUserResult);
    };

    addEventListener('user.check.result', handleCheckUserResult);
    sendMessage(message);
  });
}
