package com.example.websocket.service.post;

import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PostFetchService {

    private final PostRepository postRepository;
    private static final Logger logger = LoggerFactory.getLogger(PostFetchService.class);

    public PostFetchService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Mono<Post> getPostById(String id) {
        logger.info("Fetching post by id {}", id);
        return postRepository.findById(id);
    }

    public Flux<Post> getAllPosts() {
        logger.info("Fetching all posts");
        return postRepository.findAll();
    }
}
