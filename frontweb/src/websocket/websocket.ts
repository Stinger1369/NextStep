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
      // Handling non-JSON messages
      if (typeof event.data === 'string' && event.data.startsWith('User created with ID:')) {
        console.log('Confirmation message received:', event.data);
      } else {
        console.error('Invalid JSON or non-JSON message:', event.data);
      }
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
  // Handle incoming JSON messages from WebSocket
  console.log('Message from WebSocket:', message);
};

export const sendCreateUser = (user: Pick<User, 'emailOrPhone' | 'firstName' | 'lastName'>) => {
  const message: WebSocketMessage = {
    type: 'user.create',
    payload: user
  };
  socket.send(JSON.stringify(message));
};
