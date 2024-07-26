import { AppDispatch } from '../../../store';
import { fetchNotificationsRequest, fetchNotificationsSuccess, fetchNotificationsFailure, addNotification } from './notificationSlice';
import { getAllNotificationsByUser } from '../../../../websocket/notificationWebSocket';
import { Notification } from '../../../../types';

export const fetchNotifications = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchNotificationsRequest());
  try {
    const notifications: Notification[] = await getAllNotificationsByUser(userId);
    dispatch(fetchNotificationsSuccess(notifications));
  } catch (error) {
    if (error instanceof Error) {
      dispatch(fetchNotificationsFailure(error.message));
    } else {
      dispatch(fetchNotificationsFailure('An unknown error occurred.'));
    }
  }
};

export const addNewNotification = (notification: Notification) => (dispatch: AppDispatch) => {
  dispatch(addNotification(notification));
};
