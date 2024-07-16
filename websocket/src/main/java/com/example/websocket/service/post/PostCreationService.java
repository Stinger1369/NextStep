package com.example.websocket.service.post;

import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class PostCreationService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final Logger logger = LoggerFactory.getLogger(PostCreationService.class);

    public PostCreationService(PostRepository postRepository, UserRepository userRepository,
            NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Post> createPost(Post post) {
        logger.info("Creating post for user {}", post.getUserId());
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());

        return userRepository.findById(post.getUserId()).flatMap(user -> {
            post.setUserFirstName(user.getFirstName());
            post.setUserLastName(user.getLastName());
            return postRepository.save(post).flatMap(savedPost -> {
                user.addPost(savedPost);
                return userRepository.save(user).flatMap(updatedUser -> {
                    Notification notification = new Notification(user.getId(), user.getFirstName(),
                            user.getLastName(), "New post created: " + savedPost.getTitle(),
                            savedPost.getContent());
                    return notificationService.createNotification(notification)
                            .flatMap(savedNotification -> {
                                user.addNotification(savedNotification);
                                logger.info("Post created and notification sent for user {}",
                                        user.getId());
                                return userRepository.save(user).thenReturn(savedPost);
                            });
                });
            });
        }).switchIfEmpty(Mono.error(new Exception("Invalid userId")));
    }
}
