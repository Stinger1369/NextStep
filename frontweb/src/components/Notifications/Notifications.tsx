import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  subscribeToNotifications,
  initializeWebSocket,
  addErrorListener,
  unsubscribeFromNotifications
} from '../../websocket/notificationWebSocket';
import {
  fetchNotifications,
  addNewNotification
} from '../../redux/features/websocket/notification/notificationActions';
import {
  selectNotifications,
  selectNotificationsLoading,
  selectNotificationsError
} from '../../redux/features/websocket/notification/notificationSlice';
import './Notifications.css';

const Notifications: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);
  const userId = localStorage.getItem('currentUserId');

  useEffect(() => {
    console.log('Initializing WebSocket...');
    const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8081/ws/chat';
    initializeWebSocket(websocketUrl);

    const storedUserId = localStorage.getItem('currentUserId');

    if (storedUserId) {
      dispatch(fetchNotifications(storedUserId));
    }

    addErrorListener((error) => {
      console.error('WebSocket error:', error);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }

    console.log('Fetching all notifications for user:', userId);
    dispatch(fetchNotifications(userId));

    const unsubscribe = subscribeToNotifications(userId, (notification) => {
      console.log('New notification received:', notification);
      dispatch(addNewNotification(notification));
    });

    return () => {
      unsubscribe();
      unsubscribeFromNotifications(userId);
    };
  }, [userId, dispatch]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {sortedNotifications.map((notification, index) => (
          <li key={index}>
            <div className="notification-content">
              <strong>{notification.message}</strong>
              <p>{notification.content}</p>
              <span className="notification-date">{formatDate(notification.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
