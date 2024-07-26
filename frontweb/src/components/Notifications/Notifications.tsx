import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store'; // Import the types
import { Notification } from '../../types';
import { subscribeToNotifications, initializeWebSocket, addErrorListener, unsubscribeFromNotifications } from '../../websocket/notificationWebSocket';
import { fetchNotifications, addNewNotification } from '../../redux/features/websocket/notification/notificationActions';
import { selectNotifications, selectNotificationsLoading, selectNotificationsError } from '../../redux/features/websocket/notification/notificationSlice';
import './Notifications.css';

const Notifications: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Cast dispatch to AppDispatch
  const notifications = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);
  const userId = localStorage.getItem('currentUserId'); // Récupère l'ID utilisateur depuis le localStorage

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
    // Initial fetch of notifications
    dispatch(fetchNotifications(userId));

    // Subscribe to new notifications
    const unsubscribe = subscribeToNotifications(userId, (notification) => {
      console.log('New notification received:', notification);
      dispatch(addNewNotification(notification));
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      unsubscribeFromNotifications(userId);
    };
  }, [userId, dispatch]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Ajouter le jour de la semaine
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
      //second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <div className="notification-content">
              {notification.message}
              <span className="notification-date">{formatDate(notification.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
