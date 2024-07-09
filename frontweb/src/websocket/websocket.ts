import { User, WebSocketMessage, Post } from '../types';

let socket: WebSocket;
let createdUserId: string | null = null;
let createdUserEmailOrPhone: string | null = null;
let socketOpen: boolean = false; // New flag to track WebSocket connection state

export const initializeWebSocket = () => {
  socket = new WebSocket('ws://localhost:8080/ws/chat');

  socket.onopen = () => {
    console.log('WebSocket connected');
    socketOpen = true; // Set flag to true when WebSocket is connected
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      handleWebSocketMessage(message);
    } catch (error) {
      // Handling non-JSON messages
      if (typeof event.data === 'string') {
        if (event.data.startsWith('User created with ID:')) {
          const userId = event.data.split(': ')[1];
          console.log('User created with ID:', userId);
          createdUserId = userId; // Store the created user ID
        } else if (event.data.startsWith('Post created with ID:')) {
          console.log('Post creation confirmation received:', event.data);
        } else {
          console.error('Invalid JSON or non-JSON message:', event.data);
        }
      }
    }
  };

  socket.onerror = (error: Event) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
    socketOpen = false; // Reset flag when WebSocket is closed
  };
};

const handleWebSocketMessage = (message: WebSocketMessage) => {
  // Handle incoming JSON messages from WebSocket
  console.log('Message from WebSocket:', message);
};

export const sendCreateUser = (user: Pick<User, 'emailOrPhone' | 'firstName' | 'lastName'>) => {
  if (createdUserEmailOrPhone === user.emailOrPhone) {
    console.log('User already exists. Skipping creation.');
    return;
  }

  if (!socketOpen) {
    console.error('WebSocket is not open. Cannot send message.');
    return;
  }

  const message: WebSocketMessage = {
    type: 'user.create',
    payload: user
  };
  socket.send(JSON.stringify(message));
  createdUserEmailOrPhone = user.emailOrPhone; // Store the created user's email or phone
};

export const sendCreatePost = (content: string) => {
  if (!createdUserId) {
    console.error('User ID is not set. Cannot create post.');
    return;
  }

  if (!socketOpen) {
    console.error('WebSocket is not open. Cannot send message.');
    return;
  }

  const post: Omit<Post, '_id'> = {
    userId: createdUserId,
    title: '',
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: []
  };

  const message: WebSocketMessage = {
    type: 'post.create',
    payload: post
  };
  socket.send(JSON.stringify(message));
};
