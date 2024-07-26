package com.example.websocket.handler;

import com.example.websocket.model.Notification;
import com.example.websocket.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(NotificationWebSocketHandler.class);
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    private Map<String, WebSocketSession> sessions = new HashMap<>();

    public NotificationWebSocketHandler(ObjectMapper objectMapper,
            NotificationService notificationService) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        logger.info("New WebSocket connection established, session id: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message)
            throws IOException {
        logger.info("Received message: {}", message.getPayload());

        JsonNode jsonNode = objectMapper.readTree(message.getPayload());
        String messageType = jsonNode.get("type").asText();
        JsonNode payload = jsonNode.get("payload");

        logger.info("Message type: {}, Payload: {}", messageType, payload);

        switch (messageType) {
            case "notification.subscribe":
                handleSubscribe(session, payload);
                break;
            case "notification.unsubscribe":
                handleUnsubscribe(session, payload);
                break;
            case "notification.get":
                handleGetNotifications(session, payload);
                break;
            default:
                sendErrorMessage(session, "Unknown message type: " + messageType);
                break;
        }
    }

    private void handleSubscribe(WebSocketSession session, JsonNode payload) {
        String userId = payload.get("userId").asText();
        logger.info("User {} subscribed to notifications", userId);
    }

    private void handleUnsubscribe(WebSocketSession session, JsonNode payload) {
        String userId = payload.get("userId").asText();
        logger.info("User {} unsubscribed from notifications", userId);
    }

    private void handleGetNotifications(WebSocketSession session, JsonNode payload) {
        String userId = payload.get("userId").asText();
        logger.info("Fetching notifications for user: {}", userId);

        notificationService.getNotificationsByUserId(userId).collectList()
                .flatMap(notifications -> {
                    try {
                        logger.info("Sending notifications to user {}: {}", userId, notifications);
                        session.sendMessage(
                                new TextMessage(objectMapper.writeValueAsString(Map.of("type",
                                        "notification.get.success", "payload", notifications))));
                        return Mono.empty();
                    } catch (IOException e) {
                        logger.error("Error sending notifications to user {}", userId, e);
                        return Mono.error(e);
                    }
                }).subscribe();
    }

    private void sendErrorMessage(WebSocketSession session, String errorMessage)
            throws IOException {
        logger.error("Sending error message: {}", errorMessage);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
                Map.of("type", "error", "payload", Map.of("message", errorMessage)))));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
            org.springframework.web.socket.CloseStatus status) throws Exception {
        sessions.remove(session.getId());
        logger.info("WebSocket connection closed, session id: {}", session.getId());
    }
}
