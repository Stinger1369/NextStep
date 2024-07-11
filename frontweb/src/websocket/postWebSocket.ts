import { WebSocketMessage, Post } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export const handlePostMessage = (message: WebSocketMessage) => {
  const { type, payload } = message;

  switch (type) {
    case 'post.getAll.success':
      if (payload && typeof payload === 'object' && 'posts' in payload && Array.isArray(payload.posts)) {
        console.log('Posts received:', payload.posts);
      } else {
        console.error('Invalid payload format for post.getAll.success:', payload);
      }
      break;
    case 'post.create.success':
      console.log('Post created successfully:', payload);
      break;
    default:
      console.warn('Unhandled post message type:', type);
  }
};

export const getAllPosts = (): Promise<Post[]> => {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'post.getAll',
      payload: {}
    };

    const handleGetAllPostsResult = (data: { posts: Post[] }) => {
      if (Array.isArray(data.posts)) {
        resolve(data.posts);
      } else {
        reject(new Error('Failed to get posts'));
      }
      removeEventListener('post.getAll.success', handleGetAllPostsResult);
    };

    addEventListener('post.getAll.success', handleGetAllPostsResult);
    sendMessage(message);
  });
};

export const createPost = (content: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'post.create',
      payload: { content }
    };

    const handlePostCreateResult = (data: { postId: string }) => {
      if (data.postId) {
        resolve(data.postId);
      } else {
        reject(new Error('Post creation failed'));
      }
      removeEventListener('post.create.success', handlePostCreateResult);
    };

    addEventListener('post.create.success', handlePostCreateResult);
    sendMessage(message);
  });
};
