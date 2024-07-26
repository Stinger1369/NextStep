import { AppDispatch } from '../../../store';
import { likePostSuccess, unlikePostSuccess, sharePostSuccess, repostPostSuccess } from './postSlice';
import { sendMessage } from '../../../../websocket/websocket';
import { Like, Unlike, Share } from '../../../../types';

export const likePost = (postId: string, userId: string) => async (dispatch: AppDispatch) => {
  const like: Like = {
    id: '', // Généré côté serveur
    userId,
    entityId: postId,
    entityType: 'Post',
    createdAt: new Date().toISOString(),
    firstName: '', // À remplir avec les bonnes données
    lastName: '' // À remplir avec les bonnes données
  };

  sendMessage({
    type: 'post.like',
    payload: like
  });
  dispatch(likePostSuccess({ postId, like }));
};

export const unlikePost = (postId: string, userId: string) => async (dispatch: AppDispatch) => {
  const unlike: Unlike = {
    id: '', // Généré côté serveur
    userId,
    entityId: postId,
    entityType: 'Post',
    createdAt: new Date().toISOString(),
    firstName: '', // À remplir avec les bonnes données
    lastName: '' // À remplir avec les bonnes données
  };

  sendMessage({
    type: 'post.unlike',
    payload: unlike
  });
  dispatch(unlikePostSuccess({ postId, unlike }));
};

export const sharePost = (postId: string, email: string) => async (dispatch: AppDispatch) => {
  const share: Share = {
    id: '', // Généré côté serveur
    userId: '', // L'ID de l'utilisateur actuel
    postId,
    userEmail: email,
    sharedAt: new Date().toISOString()
  };

  sendMessage({
    type: 'post.share',
    payload: share
  });
  dispatch(sharePostSuccess({ postId, share }));
};

export const repostPost = (postId: string, userId: string) => async (dispatch: AppDispatch) => {
  sendMessage({
    type: 'post.repost',
    payload: { postId, userId }
  });
  dispatch(repostPostSuccess({ postId, userId }));
};
