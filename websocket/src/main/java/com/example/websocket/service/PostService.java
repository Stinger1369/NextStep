package com.example.websocket.service;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Post;
import com.example.websocket.service.post.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PostService {

    private final PostCreationService postCreationService;
    private final PostCommentService postCommentService;
    private final PostFetchService postFetchService;
    private final PostUpdateService postUpdateService;
    private final PostDeleteService postDeleteService;
    private final PostLikeService postLikeService;
    private final PostUnlikeService postUnlikeService;
    private final PostShareService postShareService;
    private final PostRepostService postRepostService;

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    public PostService(PostCreationService postCreationService,
            PostCommentService postCommentService, PostFetchService postFetchService,
            PostUpdateService postUpdateService, PostDeleteService postDeleteService,
            PostLikeService postLikeService, PostUnlikeService postUnlikeService,
            PostShareService postShareService, PostRepostService postRepostService) {
        this.postCreationService = postCreationService;
        this.postCommentService = postCommentService;
        this.postFetchService = postFetchService;
        this.postUpdateService = postUpdateService;
        this.postDeleteService = postDeleteService;
        this.postLikeService = postLikeService;
        this.postUnlikeService = postUnlikeService;
        this.postShareService = postShareService;
        this.postRepostService = postRepostService;
    }

    public Mono<Post> createPost(Post post) {
        logger.info("Service: Creating post");
        return postCreationService.createPost(post);
    }

    public Mono<Post> addCommentToPost(String postId, Comment comment) {
        logger.info("Service: Adding comment to post {}", postId);
        return postCommentService.addCommentToPost(postId, comment);
    }

    public Mono<Post> getPostById(String id) {
        logger.info("Service: Fetching post by id {}", id);
        return postFetchService.getPostById(id);
    }

    public Flux<Post> getAllPosts() {
        logger.info("Service: Fetching all posts");
        return postFetchService.getAllPosts();
    }

    public Mono<Post> updatePost(String id, Post post) {
        logger.info("Service: Updating post {}", id);
        return postUpdateService.updatePost(id, post);
    }

    public Mono<Void> deletePost(String id, String userId) {
        logger.info("Service: Deleting post {}", id);
        return postDeleteService.deletePost(id, userId);
    }

    public Mono<Post> likePost(String postId, String userId) {
        logger.info("Service: Liking post {}", postId);
        return postLikeService.likePost(postId, userId);
    }

    public Mono<Post> unlikePost(String postId, String userId) {
        logger.info("Service: Unliking post {}", postId);
        return postUnlikeService.unlikePost(postId, userId);
    }

    public Mono<Post> sharePost(String postId, String userId, String userEmail) {
        logger.info("Service: Sharing post {}", postId);
        return postShareService.sharePost(postId, userId, userEmail);
    }

    public Mono<Post> repostPost(String postId, String userId) {
        logger.info("Service: Reposting post {}", postId);
        return postRepostService.repostPost(postId, userId);
    }
}
