package com.example.websocket.service.user;

import com.example.websocket.model.User;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.user.UserNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class UserCreationService {

    private static final Logger logger = LoggerFactory.getLogger(UserCreationService.class);
    private final UserRepository userRepository;
    private final UserNotificationService userNotificationService;

    public UserCreationService(UserRepository userRepository,
            UserNotificationService userNotificationService) {
        this.userRepository = userRepository;
        this.userNotificationService = userNotificationService;
    }

    public Mono<User> createUser(User user) {
        if (user.getApiKey() == null || user.getApiKey().isEmpty()) {
            user.setApiKey(UUID.randomUUID().toString());
        }

        logger.info("Creating user: {}", user);
        return userRepository.save(user)
                .flatMap(savedUser -> userNotificationService.sendNotification(savedUser.getId(),
                        "User created successfully", savedUser.getId()).thenReturn(savedUser))
                .doOnSuccess(savedUser -> logger.info("User created: {}", savedUser))
                .doOnError(error -> logger.error("Error creating user: {}", error.getMessage()));
    }

    public Mono<User> createUserIfNotExists(String email, String firstName, String lastName) {
        return userRepository.findByEmail(email).flux().next().switchIfEmpty(Mono.defer(() -> {
            User newUser = new User(null, email, firstName, lastName);
            logger.info("Creating new user: {}", newUser);
            return createUser(newUser);
        })).doOnSuccess(user -> {
            if (user != null) {
                logger.info("User fetched or created: {}", user);
            }
        }).doOnError(
                error -> logger.error("Error in createUserIfNotExists: {}", error.getMessage()));
    }
}
