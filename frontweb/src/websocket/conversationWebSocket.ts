import { WebSocketMessage, Conversation } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export interface ConversationCreatedSuccessData {
  conversationId: string;
}

export interface ConversationGetAllSuccessData {
  conversations: Conversation[];
}

export function createConversation(receiverId: string, name: string, initialMessage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const senderId = localStorage.getItem('currentUserId');
    const senderFirstName = localStorage.getItem('currentUserFirstName');
    const senderLastName = localStorage.getItem('currentUserLastName');
    const receiverFirstName = localStorage.getItem('currentReceiverFirstName');
    const receiverLastName = localStorage.getItem('currentReceiverLastName');

    if (!senderId || !senderFirstName || !senderLastName || !receiverFirstName || !receiverLastName) {
      reject(new Error('User or receiver details are missing'));
      return;
    }

    const message: WebSocketMessage = {
      type: 'conversation.create',
      payload: {
        senderId,
        senderFirstName,
        senderLastName,
        receiverId,
        receiverFirstName,
        receiverLastName,
        name,
        messages: [
          {
            senderId,
            content: initialMessage,
            timestamp: new Date().toISOString()
          }
        ]
      }
    };

    console.log('Sending conversation.create message:', message);

    const handleConversationCreateResult = (data: ConversationCreatedSuccessData) => {
      console.log('Received conversation.create.success message:', data);
      if (data.conversationId) {
        resolve(data.conversationId);
      } else {
        reject(new Error('Conversation creation failed'));
      }
      removeEventListener('conversation.create.success', handleConversationCreateResult);
    };

    addEventListener('conversation.create.success', handleConversationCreateResult);
    sendMessage(message);
  });
}

export function getAllConversations(): Promise<Conversation[]> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'conversation.getAll',
      payload: {}
    };

    console.log('Sending conversation.getAll message:', message);

    const handleGetAllConversationsResult = (data: ConversationGetAllSuccessData) => {
      console.log('Received conversation.getAll.success message:', data);
      if (Array.isArray(data.conversations)) {
        resolve(data.conversations);
      } else {
        reject(new Error('Failed to get conversations'));
      }
      removeEventListener('conversation.getAll.success', handleGetAllConversationsResult);
    };

    addEventListener('conversation.getAll.success', handleGetAllConversationsResult);
    sendMessage(message);
  });
}

export function getConversationById(conversationId: string): Promise<Conversation> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'conversation.getById',
      payload: { conversationId }
    };

    console.log('Sending conversation.getById message:', message);

    const handleGetConversationResult = (data: Conversation) => {
      console.log('Received conversation.getById.success message:', data);
      resolve(data);
      removeEventListener('conversation.getById.success', handleGetConversationResult);
    };

    addEventListener('conversation.getById.success', handleGetConversationResult);
    sendMessage(message);
  });
}

export function updateConversation(conversationId: string, name: string): Promise<Conversation> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'conversation.update',
      payload: { conversationId, name }
    };

    console.log('Sending conversation.update message:', message);

    const handleUpdateConversationResult = (data: Conversation) => {
      console.log('Received conversation.update.success message:', data);
      resolve(data);
      removeEventListener('conversation.update.success', handleUpdateConversationResult);
    };

    addEventListener('conversation.update.success', handleUpdateConversationResult);
    sendMessage(message);
  });
}

export function deleteConversation(conversationId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'conversation.delete',
      payload: { conversationId }
    };

    console.log('Sending conversation.delete message:', message);

    const handleDeleteConversationResult = (data: { success: boolean }) => {
      console.log('Received conversation.delete.success message:', data);
      if (data.success) {
        resolve();
      } else {
        reject(new Error('Failed to delete conversation'));
      }
      removeEventListener('conversation.delete.success', handleDeleteConversationResult);
    };

    addEventListener('conversation.delete.success', handleDeleteConversationResult);
    sendMessage(message);
  });
}
