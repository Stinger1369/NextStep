export interface Notification {
  userId: string;
  message: string;
  type: string;
  timestamp: Date;
}

class InAppNotificationService {
  private notifications: Notification[] = [];

  public addNotification(userId: string, message: string, type: string) {
    const notification: Notification = {
      userId,
      message,
      type,
      timestamp: new Date(),
    };
    this.notifications.push(notification);
    console.log("Notification added:", notification);
  }

  public getNotifications(userId: string): Notification[] {
    return this.notifications.filter(
      (notification) => notification.userId === userId
    );
  }
}

export default InAppNotificationService;
