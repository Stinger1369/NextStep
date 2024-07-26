package com.example.websocket.service.post;

import com.example.websocket.model.Unlike;
import com.example.websocket.model.Like;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.service.LikeService;
import com.example.websocket.service.NotificationService;
import com.example.websocket.service.UnlikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PostUnlikeService {
    private static final Logger logger = LoggerFactory.getLogger(PostUnlikeService.class);
    private final PostRepository postRepository;
    private final LikeService likeService;
    private final UnlikeService unlikeService;
    private final NotificationService notificationService;

    public PostUnlikeService(PostRepository postRepository, LikeService likeService,
            UnlikeService unlikeService, NotificationService notificationService) {
        this.postRepository = postRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
        this.notificationService = notificationService;
    }

    public Mono<Post> unlikePost(String postId, String userId) {
        logger.info("User {} unliking post {}", userId, postId);

        return postRepository.findById(postId).flatMap(post -> {
            return unlikeService.hasUnlikedEntity(userId, postId, "post").flatMap(hasUnliked -> {
                if (hasUnliked) {
                    return Mono.error(new Exception("User has already unliked this post."));
                } else {
                    Unlike unlike = new Unlike(userId, postId, "post", post.getUserFirstName(),
                            post.getUserLastName());
                    return likeService.unlikeEntity(userId, postId, "post")
                            .then(unlikeService.unlikeEntity(unlike)).flatMap(savedUnlike -> {
                                post.removeLike(new Like(userId, postId, "post",
                                        post.getUserFirstName(), post.getUserLastName()));
                                post.addUnlike(savedUnlike);
                                return postRepository.save(post);
                            }).flatMap(savedPost -> {
                                Notification notification = new Notification(post.getUserId(),
                                        post.getUserFirstName(), post.getUserLastName(),
                                        "New unlike on your post",
                                        "Your post titled \"" + post.getTitle()
                                                + "\" was unliked by " + unlike.getFirstName() + " "
                                                + unlike.getLastName() + ".");
                                return notificationService.createNotification(notification)
                                        .thenReturn(savedPost);
                            });
                }
            });
        }).doOnError(error -> logger.error("Error unliking post: {}", error.getMessage()));
    }
}
