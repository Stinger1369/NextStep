declare module "notiflib" {
  export class NotificationService {
    sendEmailNotification(
      email: string,
      subject: string,
      template: string,
      variables: object
    ): Promise<void>;
  }
}
