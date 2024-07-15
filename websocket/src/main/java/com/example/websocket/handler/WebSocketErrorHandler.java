package com.example.websocket.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

public class WebSocketErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketErrorHandler.class);

    // Private constructor to prevent instantiation
    private WebSocketErrorHandler() {
        throw new UnsupportedOperationException(
                "This is a utility class and cannot be instantiated");
    }

    public static void sendErrorMessage(WebSocketSession session, String errorMessage) {
        if (session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(String.format(
                        "{\"type\":\"error\",\"payload\":{\"message\":\"%s\"}}", errorMessage)));
            } catch (IOException e) {
                logger.error("Error sending error message", e);
            }
        } else {
            logger.warn("Attempted to send error message to closed session: {}", errorMessage);
        }
    }

    public static void sendErrorMessage(WebSocketSession session, String errorMessage,
            Throwable error) {
        logger.error("{}: {}", errorMessage, error != null ? error.getMessage() : "N/A", error);
        try {
            session.sendMessage(new TextMessage(String.format(
                    "{\"type\":\"error\",\"payload\":{\"message\":\"%s\"}}", errorMessage)));
        } catch (IOException e) {
            logger.error("Error sending error message", e);
        }
    }

    public static void sendMessage(WebSocketSession session, String messageType, Object payload) {
        if (session.isOpen()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                String result = objectMapper
                        .writeValueAsString(new WebSocketResponse(messageType, payload));
                session.sendMessage(new TextMessage(result));
            } catch (IOException e) {
                logger.error("Error sending message", e);
            }
        } else {
            logger.warn("Attempted to send message to closed session: {}", messageType);
        }
    }

    static class WebSocketResponse {
        private String type;
        private Object payload;

        public WebSocketResponse(String type, Object payload) {
            this.type = type;
            this.payload = payload;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Object getPayload() {
            return payload;
        }

        public void setPayload(Object payload) {
            this.payload = payload;
        }
    }
}
