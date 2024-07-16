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
public class PostLikeService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeService likeService;
    private final NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(PostLikeService.class);

    public PostLikeService(PostRepository postRepository, UserRepository userRepository,
            LikeService likeService, NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeService = likeService;
        this.notificationService = notificationService;
    }

    public Mono<Post> likePost(String postId, String userId) {
        logger.info("Liking post {}", postId);
        return postRepository.findById(postId).flatMap(post -> {
            if (post.getUserId().equals(userId)) {
                logger.warn("User {} cannot like their own post {}", userId, postId);
                return Mono.error(new Exception("You cannot like your own post"));
            }
            return userRepository.findById(userId).flatMap(user -> {
                // Check if user has already liked the post
                boolean alreadyLiked =
                        post.getLikes().stream().anyMatch(like -> like.getUserId().equals(userId));
                if (alreadyLiked) {
                    logger.warn("User {} has already liked post {}", userId, postId);
                    return Mono.error(new Exception("You have already liked this post"));
                }
                Like like =
                        new Like(userId, postId, "post", user.getFirstName(), user.getLastName());
                return likeService.likeEntity(like).flatMap(savedLike -> {
                    post.addLike(savedLike);
                    return postRepository.save(post);
                }).flatMap(savedPost -> {
                    user.addLike(like);
                    return userRepository.save(user).thenReturn(savedPost);
                }).flatMap(savedPost -> {
                    return userRepository.findById(savedPost.getUserId()).flatMap(postOwner -> {
                        Notification notification =
                                new Notification(savedPost.getUserId(), user.getFirstName(),
                                        user.getLastName(), String.format("%s %s liked your post.",
                                                user.getFirstName(), user.getLastName()),
                                        postId);
                        return notificationService.createNotification(notification)
                                .flatMap(savedNotification -> {
                                    postOwner.addNotification(savedNotification);
                                    logger.info("Post liked and notification sent for post {}",
                                            postId);
                                    return userRepository.save(postOwner).thenReturn(savedPost);
                                });
                    });
                });
            });
        });
    }
}
