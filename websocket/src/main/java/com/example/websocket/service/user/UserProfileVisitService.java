package com.example.websocket.service.user;

import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserProfileVisitService {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileVisitService.class);
    private final UserRepository userRepository;
    private final UserNotificationService notificationService;

    public UserProfileVisitService(UserRepository userRepository,
            UserNotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Void> visitProfile(String visitorId, String visitedId) {
        logger.info("User {} visiting profile of {}", visitorId, visitedId);
        return userRepository.findById(visitedId).flatMap(visitedUser -> {
            visitedUser.addProfileVisit(visitorId);
            return userRepository.save(visitedUser).flatMap(savedVisitedUser -> {
                String message = String.format("User %s visited your profile.", visitorId);
                return notificationService.sendNotification(visitedId, message, visitorId).then();
            });
        }).doOnError(error -> logger.error("Error visiting profile: {}", error.getMessage()));
    }
}
