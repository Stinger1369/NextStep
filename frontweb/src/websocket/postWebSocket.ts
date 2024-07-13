// src/websocket/postWebSocket.ts
import { WebSocketMessage, Post } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export interface PostCreatedSuccessData {
  postId: string;
}

export interface PostGetAllSuccessData {
  posts: Post[];
}

export function createPost(content: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) {
      reject(new Error('User ID is missing'));
      return;
    }

    const message: WebSocketMessage = {
      type: 'post.create',
      payload: {
        userId,
        title: 'Default Title', // Default title
        content
      }
    };

    console.log('Sending post.create message:', message);

    const handlePostCreateResult = (data: PostCreatedSuccessData) => {
      console.log('Received post.create.success message:', data);
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
}

export function getAllPosts(): Promise<Post[]> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'post.getAll',
      payload: {}
    };

    console.log('Sending post.getAll message:', message);

    const handleGetAllPostsResult = (data: PostGetAllSuccessData) => {
      console.log('Received post.getAll.success message:', data);
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
}

export function getPostById(postId: string): Promise<Post> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'post.getById',
      payload: { postId }
    };

    console.log('Sending post.getById message:', message);

    const handleGetPostResult = (data: Post) => {
      console.log('Received post.getById.success message:', data);
      resolve(data);
      removeEventListener('post.getById.success', handleGetPostResult);
    };

    addEventListener('post.getById.success', handleGetPostResult);
    sendMessage(message);
  });
}

export function updatePost(postId: string, content: string): Promise<Post> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'post.update',
      payload: { postId, content }
    };

    console.log('Sending post.update message:', message);

    const handleUpdatePostResult = (data: Post) => {
      console.log('Received post.update.success message:', data);
      resolve(data);
      removeEventListener('post.update.success', handleUpdatePostResult);
    };

    addEventListener('post.update.success', handleUpdatePostResult);
    sendMessage(message);
  });
}

export function deletePost(postId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'post.delete',
      payload: { postId }
    };

    console.log('Sending post.delete message:', message);

    const handleDeletePostResult = (data: { success: boolean }) => {
      console.log('Received post.delete.success message:', data);
      if (data.success) {
        resolve();
      } else {
        reject(new Error('Failed to delete post'));
      }
      removeEventListener('post.delete.success', handleDeletePostResult);
    };

    addEventListener('post.delete.success', handleDeletePostResult);
    sendMessage(message);
  });
}
