import { WebSocketMessage, Post, PostCreatedSuccessData, PostGetAllSuccessData, Like, Share, Unlike } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export function createPost(content: string): Promise<PostCreatedSuccessData> {
  return new Promise((resolve, reject) => {
    const userId = localStorage.getItem('currentUserId');
    const userFirstName = localStorage.getItem('currentUserFirstName');
    const userLastName = localStorage.getItem('currentUserLastName');

    if (!userId || !userFirstName || !userLastName) {
      reject(new Error('User information is missing in localStorage'));
      return;
    }

    const message: WebSocketMessage = {
      type: 'post.create',
      payload: {
        userId,
        userFirstName,
        userLastName,
        title: 'Default Title',
        content
      }
    };

    console.log('Sending post.create message:', JSON.stringify(message));

    const handlePostCreateSuccess = (data: PostCreatedSuccessData) => {
      console.log('Post created successfully with ID:', data.postId);
      resolve({
        postId: data.postId,
        userFirstName: data.userFirstName,
        userLastName: data.userLastName,
        content: (message.payload as { content: string }).content
      });
      removeEventListener('post.create.success', handlePostCreateSuccess);
    };

    const handleError = (error: unknown) => {
      console.error('Error in createPost:', error);
      reject(new Error('Error creating post'));
      removeEventListener('error', handleError);
    };

    addEventListener('post.create.success', handlePostCreateSuccess);
    addEventListener('error', handleError);

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
