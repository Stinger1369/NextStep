// src/types.ts
export interface ApiError {
  message: string;
  status?: number;
  [key: string]: any;
}

export interface Post {
  _id: {
    $oid: string;
  };
  userId: string;
  title: string;
  content: string;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  comments: Comment[];
}


// types.ts
export interface Comment {
  _id: {
    $oid: string;
  };
  content: string;
  userId: string;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
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

export interface UserDetails {
  _id: {
    $oid: string;
  };
  username: string;
  email: string;
  apiKey: string;
  posts: Post[];
  notifications: any[];
  conversations: any[];
}
