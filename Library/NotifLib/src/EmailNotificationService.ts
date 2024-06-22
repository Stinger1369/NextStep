import nodemailer from "nodemailer";
import fs from "fs-extra";
import path from "path";

class EmailNotificationService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async loadTemplate(
    templateName: string,
    variables: Record<string, string>
  ): Promise<string> {
    const templatePath = path.resolve(
      __dirname,
      "templates",
      `${templateName}.html`
    );
    let templateContent = await fs.readFile(templatePath, "utf8");
    for (const [key, value] of Object.entries(variables)) {
      templateContent = templateContent.replace(
        new RegExp(`{{${key}}}`, "g"),
        value
      );
    }
    return templateContent;
  }

  public async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string>
  ) {
    const htmlContent = await this.loadTemplate(templateName, variables);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

export default EmailNotificationService;
