package com.example.websocket.service.post;

import com.example.websocket.model.Like;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.LikeService;
import com.example.websocket.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PostUnlikeService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeService likeService;
    private final NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(PostUnlikeService.class);

    public PostUnlikeService(PostRepository postRepository, UserRepository userRepository,
            LikeService likeService, NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeService = likeService;
        this.notificationService = notificationService;
    }

    public Mono<Post> unlikePost(String postId, String userId) {
        logger.info("Unliking post {}", postId);
        return postRepository.findById(postId).flatMap(post -> {
            return userRepository.findById(userId).flatMap(user -> {
                Like like = post.getLikes().stream().filter(l -> l.getUserId().equals(userId))
                        .findFirst().orElse(null);
                if (like == null) {
                    logger.warn("User {} has not liked post {}", userId, postId);
                    return Mono.error(new Exception("You have not liked this post"));
                }
                return likeService.unlikeEntity(userId, postId, "post").flatMap(unused -> {
                    post.removeLike(like);
                    return postRepository.save(post);
                }).flatMap(savedPost -> {
                    return userRepository.findById(userId).flatMap(likeUser -> {
                        likeUser.removeLike(like);
                        return userRepository.save(likeUser).thenReturn(savedPost);
                    });
                }).flatMap(savedPost -> {
                    return userRepository.findById(savedPost.getUserId()).flatMap(postOwner -> {
                        Notification notification = new Notification(postId, user.getFirstName(),
                                user.getLastName(), String.format("%s %s unliked your post.",
                                        user.getFirstName(), user.getLastName()),
                                postId);
                        return notificationService.createNotification(notification)
                                .flatMap(savedNotification -> {
                                    postOwner.addNotification(savedNotification);
                                    logger.info("Post unliked and notification sent for post {}",
                                            postId);
                                    return userRepository.save(postOwner).thenReturn(savedPost);
                                });
                    });
                });
            });
        });
    }
}
