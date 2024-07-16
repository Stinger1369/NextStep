package com.example.websocket.service.post;

import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PostDeleteService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(PostDeleteService.class);

    public PostDeleteService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Mono<Void> deletePost(String id, String userId) {
        logger.info("Deleting post {}", id);
        return postRepository.findById(id).flatMap(post -> {
            if (post.getUserId().equals(userId)) {
                return userRepository.findById(post.getUserId()).flatMap(user -> {
                    user.getPosts().removeIf(p -> p.getId().equals(post.getId()));
                    return userRepository.save(user).then(postRepository.deleteById(id));
                });
            } else {
                return Mono.error(new Exception("You are not the owner of this post"));
            }
        }).then();
    }
}
