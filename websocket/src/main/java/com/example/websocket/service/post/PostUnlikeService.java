package com.example.websocket.service.post;

import com.example.websocket.model.Unlike;
import com.example.websocket.model.Like;
import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.service.LikeService;
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

    public PostUnlikeService(PostRepository postRepository, LikeService likeService,
            UnlikeService unlikeService) {
        this.postRepository = postRepository;
        this.likeService = likeService;
        this.unlikeService = unlikeService;
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
                    return likeService.unlikeEntity(userId, postId, "post") // Remove existing like
                                                                            // if present
                            .then(unlikeService.unlikeEntity(unlike)).flatMap(savedUnlike -> {
                                post.removeLike(new Like(userId, postId, "post",
                                        post.getUserFirstName(), post.getUserLastName())); // Ensure
                                                                                           // like
                                                                                           // is
                                                                                           // removed
                                post.addUnlike(savedUnlike); // Add the unlike to the post
                                return postRepository.save(post);
                            });
                }
            });
        }).doOnError(error -> logger.error("Error unliking post: {}", error.getMessage()));
    }
}
