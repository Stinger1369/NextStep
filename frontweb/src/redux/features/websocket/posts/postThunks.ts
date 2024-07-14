import { AppDispatch } from '../../../store';
import { likePostSuccess, unlikePostSuccess, sharePostSuccess, repostPostSuccess } from './postSlice';
import { sendMessage } from '../../../../websocket/websocket';

export const likePost = (postId: string, userId: string) => async (dispatch: AppDispatch) => {
  sendMessage({
    type: 'post.like',
    payload: { postId, userId }
  });
  dispatch(likePostSuccess({ postId, userId }));
};

export const unlikePost = (postId: string, userId: string) => async (dispatch: AppDispatch) => {
  sendMessage({
    type: 'post.unlike',
    payload: { postId, userId }
  });
  dispatch(unlikePostSuccess({ postId, userId }));
};

export const sharePost = (postId: string, email: string) => async (dispatch: AppDispatch) => {
  sendMessage({
    type: 'post.share',
    payload: { postId, email }
  });
  dispatch(sharePostSuccess({ postId, email }));
};

export const repostPost = (postId: string, userId: string) => async (dispatch: AppDispatch) => {
  sendMessage({
    type: 'post.repost',
    payload: { postId, userId }
  });
  dispatch(repostPostSuccess({ postId, userId }));
};
