package com.example.mychat.service;

import com.example.mychat.model.User;
import com.example.mychat.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Mono<User> createUser(User user) {
        return userRepository.save(user);
    }

    public Mono<User> getUserById(String id) {
        return userRepository.findById(new ObjectId(id));
    }

    public Flux<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Mono<User> updateUser(String id, User user) {
        return userRepository.existsById(new ObjectId(id))
                .flatMap(exists -> {
                    if (exists) {
                        user.setId(new ObjectId(id));
                        return userRepository.save(user);
                    } else {
                        return Mono.empty();
                    }
                });
    }

    public Mono<Void> deleteUser(String id) {
        return userRepository.deleteById(new ObjectId(id));
    }
}
