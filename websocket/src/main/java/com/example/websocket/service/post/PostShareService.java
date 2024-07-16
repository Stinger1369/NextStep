package com.example.websocket.service.post;

import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.model.Share;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PostShareService {

    private final PostRepository postRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(PostShareService.class);

    public PostShareService(PostRepository postRepository, NotificationService notificationService,
            UserRepository userRepository) {
        this.postRepository = postRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public Mono<Post> sharePost(String postId, String userId, String userEmail) {
        logger.info("Sharing post {}", postId);
        return postRepository.findById(postId).flatMap(post -> {
            Share share = new Share(userId, postId, userEmail);
            post.addShare(share);
            return postRepository.save(post).flatMap(savedPost -> {
                Notification notification = new Notification(post.getUserId(),
                        post.getUserFirstName(), post.getUserLastName(),
                        "Your post was shared with: " + userEmail, post.getContent(), "share");
                return notificationService.createNotification(notification)
                        .flatMap(savedNotification -> userRepository.findById(post.getUserId())
                                .flatMap(postUser -> {
                                    postUser.addNotification(savedNotification);
                                    logger.info("Post shared and notification sent for post {}",
                                            postId);
                                    return userRepository.save(postUser).thenReturn(savedPost);
                                }));
            });
        });
    }
}
