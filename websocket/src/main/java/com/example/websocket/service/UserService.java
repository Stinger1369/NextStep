package com.example.websocket.service;

import com.example.websocket.model.User;
import com.example.websocket.repository.UserRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Mono<User> createUser(User user) {
        logger.info("Creating user: {}", user);
        return userRepository.save(user)
                .doOnSuccess(savedUser -> logger.info("User created: {}", savedUser))
                .doOnError(error -> logger.error("Error creating user: {}", error.getMessage()));
    }

    public Mono<User> getUserById(String id) {
        logger.info("Fetching user by id: {}", id);
        return userRepository.findById(new ObjectId(id))
                .doOnSuccess(user -> logger.info("User fetched: {}", user))
                .doOnError(error -> logger.error("Error fetching user: {}", error.getMessage()));
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
            return userRepository.save(existingUser);
        }).doOnSuccess(updatedUser -> logger.info("User updated: {}", updatedUser))
                .doOnError(error -> logger.error("Error updating user: {}", error.getMessage()));
    }

    public Mono<Void> deleteUser(String id) {
        logger.info("Deleting user with id: {}", id);
        return userRepository.deleteById(new ObjectId(id))
                .doOnSuccess(unused -> logger.info("User deleted"))
                .doOnError(error -> logger.error("Error deleting user: {}", error.getMessage()));
    }
}
