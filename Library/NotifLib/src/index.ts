import EmailNotificationService from "./EmailNotificationService";
import InAppNotificationService from "./InAppNotificationService";

class NotificationService {
  private emailService: EmailNotificationService;
  private inAppService: InAppNotificationService;

  constructor() {
    this.emailService = new EmailNotificationService();
    this.inAppService = new InAppNotificationService();
  }

  public async sendEmailNotification(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string>
  ) {
    await this.emailService.sendEmail(to, subject, templateName, variables);
  }

  public addInAppNotification(userId: string, message: string, type: string) {
    this.inAppService.addNotification(userId, message, type);
  }

  public getInAppNotifications(userId: string) {
    return this.inAppService.getNotifications(userId);
  }
}

export default NotificationService;
