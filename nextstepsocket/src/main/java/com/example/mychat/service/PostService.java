package com.example.mychat.service;

import com.example.mychat.model.Post;
import com.example.mychat.repository.PostRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Mono<Post> createPost(Post post) {
        return postRepository.save(post);
    }

    public Mono<Post> getPostById(ObjectId id) {
        return postRepository.findById(id);
    }

    public Flux<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
