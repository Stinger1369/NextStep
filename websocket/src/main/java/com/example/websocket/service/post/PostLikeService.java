package com.example.websocket.service.post;

import com.example.websocket.model.Like;
import com.example.websocket.model.Post;
import com.example.websocket.model.Unlike;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.service.LikeService;
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

    public PostLikeService(PostRepository postRepository, LikeService likeService,
            UnlikeService unlikeService) {
        this.postRepository = postRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
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
                    return unlikeService.removeUnlike(userId, postId, "post") // Remove existing
                                                                              // unlike if present
                            .then(likeService.likeEntity(like)).flatMap(savedLike -> {
                                post.removeUnlike(new Unlike(userId, postId, "post",
                                        post.getUserFirstName(), post.getUserLastName())); // Ensure
                                                                                           // unlike
                                                                                           // is
                                                                                           // removed
                                post.addLike(savedLike); // Add the like to the post
                                return postRepository.save(post);
                            });
                }
            });
        }).doOnError(error -> logger.error("Error liking post: {}", error.getMessage()));
    }
}
