package com.example.websocket.service;

import com.example.websocket.model.User;
import com.example.websocket.repository.UserRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Mono<User> createUser(User user) {
        if (user.getApiKey() == null || user.getApiKey().isEmpty()) {
            user.setApiKey(UUID.randomUUID().toString());
        }

        logger.info("Creating user: {}", user);
        return userRepository.save(user)
                .doOnSuccess(savedUser -> logger.info("User created: {}", savedUser))
                .doOnError(error -> logger.error("Error creating user: {}", error.getMessage()));
    }

    public Mono<User> getUserByApiKey(String apiKey) {
        logger.info("Fetching user by API key: {}", apiKey);
        return userRepository.findByApiKey(apiKey).doOnSuccess(user -> {
            if (user != null) {
                logger.info("User fetched: {}", user);
            } else {
                logger.warn("No user found with API key: {}", apiKey);
            }
        }).doOnError(
                error -> logger.error("Error fetching user by API key: {}", error.getMessage()));
    }

    public Mono<User> getUserById(String id) {
        logger.info("Fetching user by ID: {}", id);
        return userRepository.findById(new ObjectId(id)).doOnSuccess(user -> {
            if (user != null) {
                logger.info("User fetched: {}", user);
            } else {
                logger.warn("No user found with ID: {}", id);
            }
        }).doOnError(error -> logger.error("Error fetching user by ID: {}", error.getMessage()));
    }

    public Mono<User> getUserByEmail(String email) {
        logger.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email).doOnSuccess(user -> {
            if (user != null) {
                logger.info("User fetched: {}", user);
            } else {
                logger.warn("No user found with email: {}", email);
            }
        }).doOnError(error -> logger.error("Error fetching user by email: {}", error.getMessage()));
    }

    public Flux<User> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll().doOnComplete(() -> logger.info("All users fetched"))
                .doOnError(error -> logger.error("Error fetching users: {}", error.getMessage()));
    }

    public Mono<User> updateUser(String id, User user) {
        logger.info("Updating user: {}", user);
        return userRepository.findById(new ObjectId(id)).flatMap(existingUser -> {
            existingUser.setEmail(user.getEmail());
            existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            existingUser.setPosts(user.getPosts());
            existingUser.setNotifications(user.getNotifications());
            existingUser.setConversations(user.getConversations());
            if (user.getApiKey() == null || user.getApiKey().isEmpty()) {
                existingUser.setApiKey(UUID.randomUUID().toString());
            } else {
                existingUser.setApiKey(user.getApiKey());
            }
            return userRepository.save(existingUser);
        }).doOnSuccess(updatedUser -> logger.info("User updated: {}", updatedUser))
                .doOnError(error -> logger.error("Error updating user: {}", error.getMessage()));
    }

    public Mono<Void> deleteUser(String id) {
        logger.info("Deleting user with ID: {}", id);
        return userRepository.deleteById(new ObjectId(id))
                .doOnSuccess(unused -> logger.info("User deleted"))
                .doOnError(error -> logger.error("Error deleting user: {}", error.getMessage()));
    }
}
