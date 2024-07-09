package com.example.mychat.service;

import com.example.mychat.model.Notification;
import com.example.mychat.model.Post;
import com.example.mychat.repository.PostRepository;
import com.example.mychat.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

import java.util.Date;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository,
            NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Post> createPost(Post post) {
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());

        // Convertir le userId en ObjectId
        try {
            ObjectId userIdObjectId = new ObjectId(post.getUserId());
            post.setUserId(userIdObjectId.toHexString());
            return postRepository.save(post)
                    .flatMap(savedPost -> userRepository.findById(userIdObjectId).flatMap(user -> {
                        user.addPost(savedPost);
                        return userRepository.save(user).flatMap(updatedUser -> {
                            Notification notification = new Notification(user.getId().toHexString(),
                                    "New post created: " + savedPost.getTitle());
                            return notificationService.createNotification(notification)
                                    .flatMap(savedNotification -> {
                                        user.addNotification(savedNotification);
                                        return userRepository.save(user).thenReturn(savedPost);
                                    });
                        });
                    }));
        } catch (IllegalArgumentException e) {
            return Mono.error(new Exception("Invalid userId"));
        }
    }

    public Mono<Post> getPostById(String id) {
        return postRepository.findById(new ObjectId(id));
    }

    public Flux<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Mono<Post> updatePost(String id, Post post) {
        return postRepository.findById(new ObjectId(id)).flatMap(existingPost -> {
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setUpdatedAt(new Date());
            return postRepository.save(existingPost);
        });
    }

    public Mono<Void> deletePost(String id) {
        return postRepository.findById(new ObjectId(id)).flatMap(
                post -> userRepository.findById(new ObjectId(post.getUserId())).flatMap(user -> {
                    user.getPosts().removeIf(p -> p.getId().equals(post.getId()));
                    return userRepository.save(user)
                            .then(postRepository.deleteById(new ObjectId(id)));
                }));
    }
}
