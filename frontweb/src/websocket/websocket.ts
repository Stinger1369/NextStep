// src/websocket/websocket.ts
import { User, WebSocketMessage } from '../types';

let socket: WebSocket;

export const initializeWebSocket = () => {
  socket = new WebSocket('ws://localhost:8080/ws/chat');

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      handleWebSocketMessage(message);
    } catch (error) {
      console.error('Invalid JSON:', event.data);
    }
  };

  socket.onerror = (error: Event) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
  };
};

const handleWebSocketMessage = (message: WebSocketMessage) => {
  // Handle incoming messages from WebSocket
  console.log('Message from WebSocket:', message);
};

export const sendCreateUser = (user: User) => {
  const message: WebSocketMessage = {
    type: 'user.create',
    payload: user
  };
  socket.send(JSON.stringify(message));
};
