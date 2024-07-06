// src/types.ts

export interface ApiError {
  message: string;
  status?: number;
  [key: string]: any;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
