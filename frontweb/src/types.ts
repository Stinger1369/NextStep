// src/types.ts
export interface ApiError {
  message: string;
  status?: number;
  [key: string]: unknown;
}

export interface User {
  _id: string;
  emailOrPhone: string;
  firstName: string;
  lastName: string;
  apiKey: string;
  posts: Post[];
  notifications: Notification[];
  conversations: Conversation[];
}

export interface Post {
  _id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  _id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  _id: string;
  senderId: string;
  receiverId: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  senderId: string;
  content: string;
  timestamp: Date;
}

// Helper type to represent objects with $date property
interface DateObject {
  $date: string;
}

export function convertDates(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  for (const key in obj as Record<string, unknown>) {
    if ((obj as Record<string, unknown>).hasOwnProperty(key)) {
      const value = (obj as Record<string, unknown>)[key];
      if (typeof value === 'object' && value !== null && '$date' in value) {
        (obj as Record<string, unknown>)[key] = new Date((value as DateObject).$date);
      } else if (Array.isArray(value)) {
        (obj as Record<string, unknown>)[key] = value.map((item) => convertDates(item));
      } else if (typeof value === 'object') {
        (obj as Record<string, unknown>)[key] = convertDates(value);
      }
    }
  }

  return obj;
}

export function parseUser(userData: unknown): User {
  return convertDates(userData) as User;
}

export type WebSocketMessage =
  | { type: 'user.create'; payload: User }
  | { type: 'post.create'; payload: Post }
  | { type: 'comment.create'; payload: Comment }
  | { type: 'conversation.create'; payload: Conversation }
  | { type: string; payload: unknown };
