import { WebSocketMessage, Comment } from '../types';
import { sendMessage, addEventListener, removeEventListener } from './websocket';

export interface CommentCreatedSuccessData {
  commentId: string;
  userId: string;
  postId: string;
  content: string;
  userFirstName: string;
  userLastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentGetAllSuccessData {
  comments: Comment[];
}

const isValidDate = (date: string): boolean => {
  return !isNaN(new Date(date).getTime());
};

export function createComment(content: string, postId: string, userId: string, userFirstName: string, userLastName: string): Promise<CommentCreatedSuccessData> {
  return new Promise((resolve, reject) => {
    if (!userId || !userFirstName || !userLastName) {
      reject(new Error('User ID, first name, or last name is missing'));
      return;
    }

    const message: WebSocketMessage = {
      type: 'comment.create',
      payload: {
        userId,
        userFirstName,
        userLastName,
        postId,
        content
      }
    };

    console.log('Sending comment.create message:', message);

    const handleCommentCreateResult = (data: CommentCreatedSuccessData) => {
      console.log('Received comment.create.success message:', data);
      if (data.commentId) {
        resolve(data);
      } else {
        reject(new Error('Comment creation failed'));
      }
      removeEventListener('comment.create.success', handleCommentCreateResult);
    };

    addEventListener('comment.create.success', handleCommentCreateResult);
    sendMessage(message);
  });
}

export function getAllComments(postId: string): Promise<Comment[]> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'comment.getAll',
      payload: { postId }
    };

    console.log('Sending comment.getAll message:', message);

    const handleGetAllCommentsResult = (data: CommentGetAllSuccessData) => {
      console.log('Received comment.getAll.success message:', data);
      if (Array.isArray(data.comments)) {
        resolve(data.comments);
      } else {
        reject(new Error('Failed to get comments'));
      }
      removeEventListener('comment.getAll.success', handleGetAllCommentsResult);
    };

    addEventListener('comment.getAll.success', handleGetAllCommentsResult);
    sendMessage(message);
  });
}
export function updateComment(commentId: string, content: string): Promise<Comment> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'comment.update',
      payload: { commentId, content }
    };

    console.log('Sending comment.update message:', message);

    const handleUpdateCommentResult = (data: Comment) => {
      console.log('Received comment.update.success message:', data);
      resolve(data);
      removeEventListener('comment.update.success', handleUpdateCommentResult);
    };

    addEventListener('comment.update.success', handleUpdateCommentResult);
    sendMessage(message);
  });
}

export function deleteComment(commentId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const message: WebSocketMessage = {
      type: 'comment.delete',
      payload: { commentId }
    };

    console.log('Sending comment.delete message:', message);

    const handleDeleteCommentResult = (data: { success: boolean }) => {
      console.log('Received comment.delete.success message:', data);
      if (data.success) {
        resolve();
      } else {
        reject(new Error('Failed to delete comment'));
      }
      removeEventListener('comment.delete.success', handleDeleteCommentResult);
    };

    addEventListener('comment.delete.success', handleDeleteCommentResult);
    sendMessage(message);
  });
}
