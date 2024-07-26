import { likeEntity, unlikeEntity } from './likeWebSocket';

export function likeComment(commentId: string, userId: string): Promise<void> {
  return likeEntity(commentId, userId, 'comment');
}

export function unlikeComment(commentId: string, userId: string): Promise<void> {
  return unlikeEntity(commentId, userId, 'comment');
}

export function likeUser(userId: string, likerId: string): Promise<void> {
  return likeEntity(userId, likerId, 'user');
}

export function unlikeUser(userId: string, likerId: string): Promise<void> {
  return unlikeEntity(userId, likerId, 'user');
}
