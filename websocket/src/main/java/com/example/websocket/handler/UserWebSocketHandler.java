package com.example.websocket.handler;

import com.example.websocket.model.User;
import com.example.websocket.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Controller
public class UserWebSocketHandler {

    private final UserService userService;

    public UserWebSocketHandler(UserService userService) {
        this.userService = userService;
    }

    @MessageMapping("/user.create")
    @SendTo("/topic/user")
    public Mono<User> createUser(User user) {
        return userService.createUser(user).doOnError(error -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error creating user", error);
        });
    }

    @MessageMapping("/user.getById")
    @SendTo("/topic/user")
    public Mono<User> getUserById(String id) {
        return userService.getUserById(id).switchIfEmpty(
                Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")));
    }

    @MessageMapping("/user.getAll")
    @SendTo("/topic/users")
    public Flux<User> getAllUsers() {
        return userService.getAllUsers().doOnError(error -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error fetching users",
                    error);
        });
    }

    @MessageMapping("/user.update")
    @SendTo("/topic/user")
    public Mono<User> updateUser(User user) {
        return userService.updateUser(user.getId().toHexString(), user)
                .switchIfEmpty(Mono
                        .error(new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")))
                .doOnError(error -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error updating user",
                            error);
                });
    }

    @MessageMapping("/user.delete")
    @SendTo("/topic/user")
    public Mono<Void> deleteUser(String id) {
        return userService.deleteUser(id).then().doOnError(error -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error deleting user", error);
        });
    }
}
