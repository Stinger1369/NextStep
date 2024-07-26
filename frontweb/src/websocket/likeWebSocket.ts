// src/websocket/likeWebSocket.ts
import { WebSocketMessage } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export function likeEntity(entityId: string, userId: string, entityType: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: `${entityType}.like`,
      payload: { postId: entityId, userId } // Utilisez postId au lieu de entityId
    };

    const handleLikeSuccess = () => {
      resolve();
      removeEventListener(`${entityType}.like.success`, handleLikeSuccess);
    };

    const handleError = (error: unknown) => {
      reject(error);
      removeEventListener('error', handleError);
    };

    addEventListener(`${entityType}.like.success`, handleLikeSuccess);
    addEventListener('error', handleError);

    sendMessage(message);
  });
}

export function unlikeEntity(entityId: string, userId: string, entityType: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: `${entityType}.unlike`,
      payload: { postId: entityId, userId } // Utilisez postId au lieu de entityId
    };

    const handleUnlikeSuccess = () => {
      resolve();
      removeEventListener(`${entityType}.unlike.success`, handleUnlikeSuccess);
    };

    const handleError = (error: unknown) => {
      reject(error);
      removeEventListener('error', handleError);
    };

    addEventListener(`${entityType}.unlike.success`, handleUnlikeSuccess);
    addEventListener('error', handleError);

    sendMessage(message);
  });
}
