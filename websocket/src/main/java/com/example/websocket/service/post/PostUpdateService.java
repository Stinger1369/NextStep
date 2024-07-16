package com.example.websocket.service.post;

import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Date;

@Service
public class PostUpdateService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(PostUpdateService.class);

    public PostUpdateService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Mono<Post> updatePost(String id, Post post) {
        logger.info("Updating post {}", id);
        return postRepository.findById(id).flatMap(existingPost -> {
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setComments(post.getComments());
            existingPost.setLikes(post.getLikes());
            existingPost.setUpdatedAt(new Date());
            return postRepository.save(existingPost).flatMap(updatedPost -> {
                return userRepository.findById(post.getUserId()).flatMap(user -> {
                    user.getPosts().stream().filter(p -> p.getId().equals(post.getId()))
                            .forEach(p -> {
                                p.setTitle(post.getTitle());
                                p.setContent(post.getContent());
                                p.setComments(post.getComments());
                                p.setLikes(post.getLikes());
                                p.setUpdatedAt(new Date());
                            });
                    return userRepository.save(user).thenReturn(updatedPost);
                });
            });
        });
    }
}
