import { WebSocketMessage } from '../types';
import { handleUserMessage } from './userWebSocket';
import { handlePostMessage } from './postWebSocket';

const WS_URL = 'ws://localhost:8080/ws/chat';
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

export let socket: WebSocket | null = null;
let isConnected = false;
let reconnectAttempts = 0;
let messageQueue: WebSocketMessage[] = [];
let eventListeners: { [key: string]: ((data: any) => void)[] } = {};

export const initializeWebSocket = () => {
  if (socket !== null) {
    console.log('WebSocket already initialized');
    return;
  }
  connect();
};

const connect = () => {
  socket = new WebSocket(WS_URL);
  socket.onopen = handleOpen;
  socket.onmessage = handleMessage;
  socket.onerror = handleError;
  socket.onclose = handleClose;
};

const handleOpen = () => {
  console.log('WebSocket connected');
  isConnected = true;
  reconnectAttempts = 0;
  flushQueue();
};

const handleError = (event: Event) => {
  console.error('WebSocket error:', event);
};

const handleClose = (event: CloseEvent) => {
  console.log('WebSocket closed:', event.reason);
  isConnected = false;
  socket = null;

  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      reconnectAttempts++;
      connect();
    }, RECONNECT_INTERVAL);
  } else {
    console.error('Max reconnect attempts reached');
  }
};

export const sendMessage = (message: WebSocketMessage) => {
  console.log('Sending WebSocket message:', message);
  if (isConnected && socket) {
    socket.send(JSON.stringify(message));
  } else {
    console.log('WebSocket not connected, queueing message');
    messageQueue.push(message);
  }
};

const handleMessage = (event: MessageEvent) => {
  console.log('Raw message received:', event.data);
  try {
    const message: WebSocketMessage = JSON.parse(event.data);
    console.log('Parsed message:', message);
    handleWebSocketMessage(message);
    triggerEventListeners(message.type, message.payload);
  } catch (error) {
    console.error('Error parsing message:', error, 'Message:', event.data);
  }
};

const flushQueue = () => {
  while (messageQueue.length > 0) {
    const message = messageQueue.shift();
    if (message) sendMessage(message);
  }
};
const handleWebSocketMessage = (message: WebSocketMessage) => {
  const { type } = message;

  if (type.startsWith('user.')) {
    handleUserMessage(message);
  } else if (type.startsWith('post.')) {
    handlePostMessage(message);
  } else if (type === 'error') {
    console.error('Error message from server:', message.payload);
  } else {
    console.warn('Unhandled message type:', type);
  }
};

export const addEventListener = (type: string, callback: (data: any) => void) => {
  if (!eventListeners[type]) {
    eventListeners[type] = [];
  }
  eventListeners[type].push(callback);
};

export const removeEventListener = (type: string, callback: (data: any) => void) => {
  if (eventListeners[type]) {
    eventListeners[type] = eventListeners[type].filter((cb) => cb !== callback);
  }
};

const triggerEventListeners = (type: string, data: any) => {
  if (eventListeners[type]) {
    eventListeners[type].forEach((callback) => callback(data));
  }
};

export const isSocketOpen = () => isConnected;
