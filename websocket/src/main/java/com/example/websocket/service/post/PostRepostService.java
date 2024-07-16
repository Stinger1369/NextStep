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

@Service
public class PostRepostService {

    private final PostRepository postRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(PostRepostService.class);

    public PostRepostService(PostRepository postRepository, NotificationService notificationService,
            UserRepository userRepository) {
        this.postRepository = postRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public Mono<Post> repostPost(String postId, String userId) {
        logger.info("Reposting post {}", postId);
        return postRepository.findById(postId).flatMap(post -> {
            post.incrementRepostCount();
            post.addReposter(userId);
            return postRepository.save(post).flatMap(savedPost -> {
                Notification notification = new Notification(post.getUserId(),
                        post.getUserFirstName(), post.getUserLastName(),
                        "Your post was reposted by user: " + userId, post.getContent());
                return notificationService.createNotification(notification)
                        .flatMap(savedNotification -> userRepository.findById(post.getUserId())
                                .flatMap(postUser -> {
                                    postUser.addNotification(savedNotification);
                                    logger.info("Post reposted and notification sent for post {}",
                                            postId);
                                    return userRepository.save(postUser).thenReturn(savedPost);
                                }));
            });
        });
    }
}
