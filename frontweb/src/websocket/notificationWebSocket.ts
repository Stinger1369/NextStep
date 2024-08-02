import { WebSocketMessage, Notification } from '../types';
import {
  sendMessage,
  addEventListener,
  removeEventListener,
  initializeWebSocket,
  addErrorListener
} from './websocket';

export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
): () => void {
  const message: WebSocketMessage = {
    type: 'notification.subscribe',
    payload: { userId }
  };

  const handleNotification = (data: Notification) => {
    console.log('Received notification:', data);
    callback(data);
  };

  addEventListener('notification', handleNotification);
  sendMessage(message);

  return () => {
    removeEventListener('notification', handleNotification);
  };
}

export function unsubscribeFromNotifications(userId: string): void {
  const message: WebSocketMessage = {
    type: 'notification.unsubscribe',
    payload: { userId }
  };

  sendMessage(message);
}

export function getAllNotificationsByUser(userId: string): Promise<Notification[]> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'notification.getAllByUser',
      payload: { userId }
    };

    const handleGetAllNotificationsResult = (data: Notification[]) => {
      console.log('Fetched all notifications:', data);
      resolve(data);
      removeEventListener('notification.getAllByUser.success', handleGetAllNotificationsResult);
    };

    const handleError = (error: unknown) => {
      console.error('Error fetching all notifications:', error);
      reject(error);
      removeEventListener('notification.getAllByUser.success', handleGetAllNotificationsResult);
      removeEventListener('error', handleError);
    };

    addEventListener('notification.getAllByUser.success', handleGetAllNotificationsResult);
    addEventListener('error', handleError);

    sendMessage(message);
  });
}

export { initializeWebSocket, addErrorListener };
