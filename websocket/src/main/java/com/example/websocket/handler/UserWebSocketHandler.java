package com.example.websocket.handler;

import com.example.websocket.model.User;
import com.example.websocket.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import io.netty.channel.ChannelHandler.Sharable;

@Sharable
@Controller
public class UserWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserWebSocketHandler.class);
    private static final String USER_NOT_FOUND = "User not found";

    private final UserService userService;

    public UserWebSocketHandler(UserService userService) {
        this.userService = userService;
    }

    @MessageMapping("/user.create")
    @SendTo("/topic/user")
    public Mono<User> createUser(User user) {
        logger.info("Received create user request: {}", user);
        return userService.createUser(user)
                .doOnSuccess(
                        createdUser -> logger.info("Successfully created user: {}", createdUser))
                .doOnError(error -> {
                    logger.error("Error creating user: {}", error.getMessage());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error creating user",
                            error);
                });
    }

    @MessageMapping("/user.getById")
    @SendTo("/topic/user")
    public Mono<User> getUserById(String id) {
        logger.info("Received get user by id request: {}", id);
        return userService.getUserById(id)
                .doOnSuccess(user -> logger.info("Successfully retrieved user: {}", user))
                .doOnError(error -> {
                    logger.error("Error retrieving user: {}", error.getMessage());
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, USER_NOT_FOUND, error);
                }).switchIfEmpty(Mono
                        .error(new ResponseStatusException(HttpStatus.NOT_FOUND, USER_NOT_FOUND)));
    }

    @MessageMapping("/user.getAll")
    @SendTo("/topic/users")
    public Flux<User> getAllUsers() {
        logger.info("Received get all users request");
        return userService.getAllUsers()
                .doOnComplete(() -> logger.info("Successfully retrieved all users"))
                .doOnError(error -> {
                    logger.error("Error fetching users: {}", error.getMessage());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Error fetching users", error);
                });
    }

    @MessageMapping("/user.update")
    @SendTo("/topic/user")
    public Mono<User> updateUser(User user) {
        logger.info("Received update user request: {}", user);
        return userService.updateUser(user.getId().toHexString(), user)
                .doOnSuccess(
                        updatedUser -> logger.info("Successfully updated user: {}", updatedUser))
                .doOnError(error -> {
                    logger.error("Error updating user: {}", error.getMessage());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error updating user",
                            error);
                }).switchIfEmpty(Mono
                        .error(new ResponseStatusException(HttpStatus.NOT_FOUND, USER_NOT_FOUND)));
    }

    @MessageMapping("/user.delete")
    @SendTo("/topic/user")
    public Mono<Void> deleteUser(String id) {
        logger.info("Received delete user request: {}", id);
        return userService.deleteUser(id)
                .doOnSuccess(v -> logger.info("Successfully deleted user with id: {}", id))
                .doOnError(error -> {
                    logger.error("Error deleting user: {}", error.getMessage());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error deleting user",
                            error);
                });
    }
}
