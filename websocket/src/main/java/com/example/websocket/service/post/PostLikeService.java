package com.example.websocket.service.post;

import com.example.websocket.model.Like;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.model.Unlike;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.service.LikeService;
import com.example.websocket.service.NotificationService;
import com.example.websocket.service.UnlikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PostLikeService {
    private static final Logger logger = LoggerFactory.getLogger(PostLikeService.class);
    private final PostRepository postRepository;
    private final LikeService likeService;
    private final UnlikeService unlikeService;
    private final NotificationService notificationService;

    public PostLikeService(PostRepository postRepository, LikeService likeService,
            UnlikeService unlikeService, NotificationService notificationService) {
        this.postRepository = postRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
        this.notificationService = notificationService;
    }

    public Mono<Post> likePost(String postId, String userId) {
        logger.info("User {} liking post {}", userId, postId);

        return postRepository.findById(postId).flatMap(post -> {
            return likeService.hasLikedEntity(userId, postId, "post").flatMap(hasLiked -> {
                if (hasLiked) {
                    return Mono.error(new Exception("User has already liked this post."));
                } else {
                    Like like = new Like(userId, postId, "post", post.getUserFirstName(),
                            post.getUserLastName());
                    return unlikeService.removeUnlike(userId, postId, "post")
                            .then(likeService.likeEntity(like)).flatMap(savedLike -> {
                                post.removeUnlike(new Unlike(userId, postId, "post",
                                        post.getUserFirstName(), post.getUserLastName()));
                                post.addLike(savedLike);
                                return postRepository.save(post);
                            }).flatMap(savedPost -> {
                                Notification notification =
                                        new Notification(post.getUserId(), post.getUserFirstName(),
                                                post.getUserLastName(), "New like on your post",
                                                "Your post titled \"" + post.getTitle()
                                                        + "\" was liked by " + like.getFirstName()
                                                        + " " + like.getLastName() + ".");
                                return notificationService.createNotification(notification)
                                        .thenReturn(savedPost);
                            });
                }
            });
        }).doOnError(error -> logger.error("Error liking post: {}", error.getMessage()));
    }
}
