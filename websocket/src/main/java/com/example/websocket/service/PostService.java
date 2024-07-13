package com.example.websocket.service;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

import java.util.Date;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PostService(PostRepository postRepository, UserRepository userRepository,
            NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Post> createPost(Post post) {
    post.setCreatedAt(new Date());
    post.setUpdatedAt(new Date());

    return userRepository.findById(post.getUserId()).flatMap(user ->
        postRepository.save(post).flatMap(savedPost -> {
            user.addPost(savedPost);
            return userRepository.save(user).flatMap(updatedUser -> {
                Notification notification = new Notification(user.getId(), "New post created: " + savedPost.getTitle());
                return notificationService.createNotification(notification).flatMap(savedNotification -> {
                    user.addNotification(savedNotification);
                    return userRepository.save(user).thenReturn(savedPost);
                });
            });
        })
    ).switchIfEmpty(Mono.error(new Exception("Invalid userId")));
}


    public Mono<Post> addCommentToPost(String postId, Comment comment) {
        return postRepository.findById(postId).flatMap(post -> {
            post.addComment(comment);
            post.setUpdatedAt(new Date());
            return postRepository.save(post);
        });
    }
    public Mono<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Flux<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Mono<Post> updatePost(String id, Post post) {
        return postRepository.findById(id).flatMap(existingPost -> {
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setUpdatedAt(new Date());
            return postRepository.save(existingPost);
        });
    }

    public Mono<Void> deletePost(String id) {
        return postRepository.findById(id).flatMap(post -> {
            return userRepository.findById(post.getUserId()).flatMap(user -> {
                user.getPosts().removeIf(p -> p.getId().equals(post.getId()));
                return userRepository.save(user).then(postRepository.deleteById(id));
            });
        });
    }

    public Mono<Post> likePost(String postId, String userId) {
        return postRepository.findById(postId).flatMap(post -> {
            post.addLike(userId);
            return postRepository.save(post);
        });
    }

    public Mono<Post> unlikePost(String postId, String userId) {
        return postRepository.findById(postId).flatMap(post -> {
            post.removeLike(userId);
            return postRepository.save(post);
        });
    }

    public Mono<Post> sharePost(String postId, String email) {
        return postRepository.findById(postId).flatMap(post -> {
            post.addShare(email);
            return postRepository.save(post);
        });
    }

    public Mono<Post> repostPost(String postId) {
        return postRepository.findById(postId).flatMap(post -> {
            post.incrementRepostCount();
            return postRepository.save(post);
        });
    }
}
