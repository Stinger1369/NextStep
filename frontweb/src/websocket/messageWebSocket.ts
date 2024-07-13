import { WebSocketMessage, Message } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export interface MessageCreatedSuccessData {
  messageId: string;
}

export function createMessage(conversationId: string, content: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const senderId = localStorage.getItem('currentUserId');
    const senderFirstName = localStorage.getItem('currentUserFirstName');
    const senderLastName = localStorage.getItem('currentUserLastName');

    if (!senderId || !senderFirstName || !senderLastName) {
      reject(new Error('User details are missing'));
      return;
    }

    const message: WebSocketMessage = {
      type: 'message.create',
      payload: {
        conversationId,
        senderId,
        senderFirstName,
        senderLastName,
        content,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Sending message.create message:', message);

    const handleMessageCreateResult = (data: MessageCreatedSuccessData) => {
      console.log('Received message.create.success message:', data);
      if (data.messageId) {
        resolve(data.messageId);
      } else {
        reject(new Error('Message creation failed'));
      }
      removeEventListener('message.create.success', handleMessageCreateResult);
    };

    addEventListener('message.create.success', handleMessageCreateResult);
    sendMessage(message);
  });
}
