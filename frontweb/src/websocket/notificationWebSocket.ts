import { WebSocketMessage, Notification } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export function subscribeToNotifications(userId: string, callback: (notification: Notification) => void): () => void {
  const message: WebSocketMessage = {
    type: 'notification.subscribe',
    payload: { userId }
  };

  const handleNotification = (data: Notification) => {
    console.log('Received notification:', data); // Add this log
    callback(data);
  };

  addEventListener('notification', handleNotification);
  sendMessage(message);

  // Return a function to unsubscribe
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

export function getNotifications(userId: string): Promise<Notification[]> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'notification.get',
      payload: { userId }
    };

    const handleGetNotificationsResult = (data: Notification[]) => {
      console.log('Fetched notifications:', data); // Add this log
      resolve(data);
      removeEventListener('notification.get.success', handleGetNotificationsResult);
    };

    const handleError = (error: unknown) => {
      console.error('Error fetching notifications:', error); // Add this log
      reject(error);
      removeEventListener('notification.get.success', handleGetNotificationsResult);
      removeEventListener('error', handleError);
    };

    addEventListener('notification.get.success', handleGetNotificationsResult);
    addEventListener('error', handleError);

    sendMessage(message);
  });
}
