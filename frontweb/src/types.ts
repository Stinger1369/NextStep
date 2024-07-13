export interface Post {
  id: string;
  userId: string;
  userFirstName: string; // Ajouté
  userLastName: string; // Ajouté
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  comments: Comment[];
  likes: string[];
  shares: string[];
  repostCount: number;
}
export interface Comment {
  id: string;
  userId: string;
  firstName: string; // Ajouté
  lastName: string; // Ajouté
  postId: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ApiError {
  message: string;
  status?: number;
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  apiKey: string;
  posts: Post[];
  notifications: Notification[];
  conversations: Conversation[];
}

export interface Notification {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  _id: string;
  senderId: string;
  senderFirstName: string;
  senderLastName: string;
  receiverId: string;
  receiverFirstName: string;
  receiverLastName: string;
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

// Function to convert dates from JSON format to Date objects
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

// Function to parse User data and convert date fields
export function parseUser(userData: unknown): User {
  return convertDates(userData) as User;
}

export type ErrorPayload = {
  error: string;
};

export type WebSocketMessage =
  | { type: 'user.create'; payload: Partial<User> }
  | { type: 'user.getCurrent'; payload: Record<string, never> }
  | { type: 'user.getByEmail'; payload: { email: string } }
  | { type: 'user.getById'; payload: { userId: string } }
  | { type: 'user.update'; payload: Partial<User> & { userId: string } }
  | { type: 'user.delete'; payload: { userId: string } }
  | { type: 'user.check'; payload: { email: string } }
  | { type: 'post.create'; payload: Omit<Post, 'id'> }
  | { type: 'post.getAll'; payload: Record<string, never> }
  | { type: 'post.getById'; payload: { postId: string } }
  | { type: 'post.update'; payload: { postId: string; content: string } }
  | { type: 'post.delete'; payload: { postId: string } }
  | { type: 'comment.create'; payload: Omit<Comment, 'id'> }
  | { type: 'conversation.create'; payload: Omit<Conversation, 'id'> }
  | { type: 'conversation.getById'; payload: { conversationId: string } }
  | { type: 'conversation.getAll'; payload: Record<string, never> }
  | { type: 'conversation.update'; payload: { conversationId: string; name: string } }
  | { type: 'conversation.delete'; payload: { conversationId: string } }
  | { type: 'error'; payload: ErrorPayload }
  | { type: string; payload: unknown };
