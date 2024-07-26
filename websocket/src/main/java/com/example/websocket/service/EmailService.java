package com.example.websocket.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;

        String htmlMsg = "<html>"
                + "<body style='font-family: Arial, sans-serif; margin: 0; padding: 0;'>"
                + "<div style='max-width: 600px; margin: auto; border: 1px solid #cccccc; border-radius: 5px; overflow: hidden;'>"
                + "<div style='background-color: #0077b5; color: white; padding: 20px; text-align: center;'>"
                + "<h1 style='margin: 0;'>WebSocket App</h1>" + "</div>"
                + "<div style='padding: 20px;'>"
                + "<p style='font-size: 16px;'>Dear <strong>bilel zaaraoui</strong>,</p>"
                + "<p style='font-size: 16px;'>" + body + "</p>"
                + "<p style='font-size: 16px;'>Best regards,<br>Your WebSocket App Team</p>"
                + "</div>"
                + "<div style='background-color: #f4f4f4; color: #888888; padding: 10px; text-align: center; font-size: 12px;'>"
                + "<p style='margin: 0;'>© 2024 WebSocket App. All rights reserved.</p>" + "</div>"
                + "</div>" + "</body>" + "</html>";

        try {
            helper = new MimeMessageHelper(message, "utf-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlMsg, true);
            helper.setFrom("contact@neststep.fr");
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
