import React, { useEffect, useState } from 'react';
import { Notification } from '../../types';
import { subscribeToNotifications, getNotifications, unsubscribeFromNotifications } from '../../websocket/notificationWebSocket';
import './Notifications.css';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userId = 'user-id'; // Remplacez ceci par la manière dont vous obtenez l'ID utilisateur dans votre application

  useEffect(() => {
    console.log('Fetching notifications for user:', userId);
    // Initial fetch of notifications
    getNotifications(userId)
      .then((notifications) => {
        console.log('Notifications fetched:', notifications); // Add this log
        setNotifications(notifications);
      })
      .catch((error) => console.error('Error fetching notifications:', error));

    // Subscribe to new notifications
    const unsubscribe = subscribeToNotifications(userId, (notification) => {
      console.log('New notification received:', notification); // Add this log
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      unsubscribeFromNotifications(userId);
    };
  }, [userId]);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
