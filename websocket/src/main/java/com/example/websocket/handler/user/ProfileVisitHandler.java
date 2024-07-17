package com.example.websocket.handler.user;

import com.example.websocket.handler.WebSocketErrorHandler;
import com.example.websocket.model.Notification;
import com.example.websocket.service.UserService;
import com.example.websocket.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class ProfileVisitHandler {
        private static final Logger logger = LoggerFactory.getLogger(ProfileVisitHandler.class);
        private static final String VISITOR_ID = "visitorId";
        private static final String VISITED_ID = "visitedId";
        private static final String VISITOR_FIRST_NAME = "visitorFirstName";
        private static final String VISITOR_LAST_NAME = "visitorLastName";
        private static final String CONTENT = "content";

        private final UserService userService;
        private final NotificationService notificationService;

        public ProfileVisitHandler(UserService userService,
                        NotificationService notificationService) {
                this.userService = userService;
                this.notificationService = notificationService;
        }

        public void handleProfileVisit(WebSocketSession session, JsonNode payload) {
                logger.info("Handling profile.visit with payload: {}", payload);

                if (payload.hasNonNull(VISITOR_ID) && payload.hasNonNull(VISITED_ID)
                                && payload.hasNonNull(VISITOR_FIRST_NAME)
                                && payload.hasNonNull(VISITOR_LAST_NAME)
                                && payload.hasNonNull(CONTENT)) {
                        String visitorId = payload.get(VISITOR_ID).asText();
                        String visitedId = payload.get(VISITED_ID).asText();
                        String visitorFirstName = payload.get(VISITOR_FIRST_NAME).asText();
                        String visitorLastName = payload.get(VISITOR_LAST_NAME).asText();
                        String content = payload.get(CONTENT).asText();

                        logger.info("User with visitorId: {} is visiting profile of user with visitedId: {}",
                                        visitorId, visitedId);

                        userService.visitProfile(visitorId, visitedId, visitorFirstName,
                                        visitorLastName).subscribe(unused -> {
                                                WebSocketErrorHandler.sendMessage(session,
                                                                "profile.visit.recorded", null);
                                                logger.info("Profile visit recorded: visitorId={}, visitedId={}",
                                                                visitorId, visitedId);

                                                // Create a notification
                                                String message = String.format(
                                                                "User %s %s visited your profile.",
                                                                visitorFirstName, visitorLastName);
                                                Notification notification = new Notification(
                                                                visitorId, visitorFirstName,
                                                                visitorLastName, message, content,
                                                                "profile_visit");
                                                notificationService.createNotification(notification)
                                                                .subscribe();
                                        }, error -> {
                                                logger.error("Error recording profile visit: visitorId={}, visitedId={}",
                                                                visitorId, visitedId, error);
                                                WebSocketErrorHandler.sendErrorMessage(session,
                                                                "Error recording profile visit",
                                                                error);
                                        });
                } else {
                        logger.error("Missing fields in profile.visit payload: visitorId={}, visitedId={}",
                                        payload.hasNonNull(VISITOR_ID),
                                        payload.hasNonNull(VISITED_ID));
                        WebSocketErrorHandler.sendErrorMessage(session,
                                        "Missing fields in profile.visit payload");
                }
        }
}
