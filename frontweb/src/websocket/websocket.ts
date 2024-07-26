import { WebSocketMessage } from '../types';

let socket: WebSocket | null = null;
const messageQueue: WebSocketMessage[] = [];
const eventListeners: { [key: string]: EventCallback[] } = {};

export const initializeWebSocket = (url: string): void => {
  if (socket) {
    console.log('WebSocket already initialized');
    return;
  }

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection established');
    sendQueuedMessages();
  };

  socket.onmessage = (event: MessageEvent) => {
    console.log('Raw message received:', event.data);
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log('Parsed message:', message);
      triggerEventListeners(message.type, message.payload);
    } catch (error) {
      console.error('Error parsing message:', error);
      triggerEventListeners('error', { message: 'Error parsing message', error });
    }
  };

  socket.onerror = (event: Event) => {
    console.error('WebSocket error:', event);
    triggerEventListeners('error', { message: 'WebSocket error', event });
  };
  socket.onclose = () => {
    console.log('WebSocket connection closed');
    socket = null;
  };
};

export const sendMessage = (message: WebSocketMessage): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const messageString = JSON.stringify(message);
    console.log('Sending WebSocket message:', messageString);
    socket.send(messageString);
  } else {
    console.log('Queueing message:', message);
    messageQueue.push(message);
  }
};

const sendQueuedMessages = (): void => {
  while (messageQueue.length > 0) {
    const message = messageQueue.shift();
    if (message) {
      sendMessage(message);
    }
  }
};

type EventCallback<T = unknown> = (data: T) => void;

export const addEventListener = <T>(type: string, callback: EventCallback<T>): void => {
  console.log('Added event listener for type:', type);
  if (!eventListeners[type]) {
    eventListeners[type] = [];
  }
  eventListeners[type].push(callback as EventCallback);
};

export const removeEventListener = <T>(type: string, callback: EventCallback<T>): void => {
  if (eventListeners[type]) {
    eventListeners[type] = eventListeners[type].filter((cb) => cb !== callback);
  }
};

export const addErrorListener = (callback: (error: unknown) => void): void => {
  addEventListener<unknown>('error', callback);
};

const triggerEventListeners = <T>(type: string, data: T): void => {
  console.log('Triggering event listeners for type:', type);
  if (eventListeners[type]) {
    eventListeners[type].forEach((callback) => callback(data));
  } else {
    console.log('No event listeners for type:', type);
  }
};
