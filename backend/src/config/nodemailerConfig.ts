// src/config/nodemailerConfig.ts
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getEmailTemplate = (
  templatePath: string,
  variables: { [key: string]: string }
) => {
  const filePath = path.join(__dirname, templatePath);
  let emailTemplate = fs.readFileSync(filePath, "utf-8");

  for (const key in variables) {
    emailTemplate = emailTemplate.replace(
      new RegExp(`{{${key}}}`, "g"),
      variables[key]
    );
  }

  return emailTemplate;
};

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  const emailTemplate = getEmailTemplate(
    "../../templates/verificationEmail.html",
    { verificationCode }
  );
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification Code",
    html: emailTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (
  email: string,
  resetCode: string
) => {
  const emailTemplate = getEmailTemplate(
    "../../templates/passwordResetEmail.html",
    { resetCode }
  );
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Code",
    html: emailTemplate,
  };

  await transporter.sendMail(mailOptions);
};
