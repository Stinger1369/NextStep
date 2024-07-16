package com.example.websocket.service.user;

import com.example.websocket.model.User;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserFetchService {

    private static final Logger logger = LoggerFactory.getLogger(UserFetchService.class);
    private static final String USER_FETCHED = "User fetched: {}";

    private final UserRepository userRepository;

    public UserFetchService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Mono<User> getUserByApiKey(String apiKey) {
        logger.info("Fetching user by API key: {}", apiKey);
        return userRepository.findByApiKey(apiKey).doOnSuccess(user -> {
            if (user != null) {
                logger.info(USER_FETCHED, user);
            } else {
                logger.warn("No user found with API key: {}", apiKey);
            }
        }).doOnError(
                error -> logger.error("Error fetching user by API key: {}", error.getMessage()));
    }

    public Mono<User> getUserById(String id) {
        logger.info("Fetching user by ID: {}", id);
        return userRepository.findById(id).doOnSuccess(user -> {
            if (user != null) {
                logger.info(USER_FETCHED, user);
            } else {
                logger.warn("No user found with ID: {}", id);
            }
        }).doOnError(error -> logger.error("Error fetching user by ID: {}", error.getMessage()));
    }

    public Mono<User> getUserByEmail(String email) {
        logger.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email).flux().next().doOnSuccess(user -> {
            if (user != null) {
                logger.info(USER_FETCHED, user);
            } else {
                logger.warn("No user found with email: {}", email);
            }
        }).doOnError(error -> {
            if (error instanceof IncorrectResultSizeDataAccessException) {
                logger.error("Multiple users found with email: {}", email);
            } else {
                logger.error("Error fetching user by email: {}", error.getMessage());
            }
        });
    }

    public Flux<User> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll().doOnComplete(() -> logger.info("All users fetched"))
                .doOnError(error -> logger.error("Error fetching users: {}", error.getMessage()));
    }

    public Mono<Void> deleteUser(String id) {
        logger.info("Deleting user with ID: {}", id);
        return userRepository.deleteById(id)
                .doOnSuccess(unused -> logger.info("User deleted with ID: {}", id))
                .doOnError(error -> logger.error("Error deleting user: {}", error.getMessage()));
    }
}
