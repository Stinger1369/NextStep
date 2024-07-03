package com.example.mychat.service;

import com.example.mychat.model.Comment;
import com.example.mychat.model.Notification;
import com.example.mychat.model.Post;
import com.example.mychat.repository.CommentRepository;
import com.example.mychat.repository.NotificationRepository;
import com.example.mychat.repository.PostRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

import java.util.Date;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
            NotificationRepository notificationRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.notificationRepository = notificationRepository;
    }

    public Mono<Comment> createComment(Comment comment) {
        return commentRepository.save(comment)
                .flatMap(savedComment -> postRepository.findById(savedComment.getPostId())
                        .flatMap(post -> {
                            post.addComment(savedComment);
                            return postRepository.save(post)
                                    .then(notificationRepository.save(new Notification(post.getUserId(),
                                            "New comment on your post")))
                                    .thenReturn(savedComment);
                        }));
    }

    public Mono<Comment> updateComment(String id, Comment comment) {
        return commentRepository.findById(new ObjectId(id))
                .flatMap(existingComment -> {
                    existingComment.setContent(comment.getContent());
                    existingComment.setUpdatedAt(new Date());
                    return commentRepository.save(existingComment)
                            .flatMap(updatedComment -> postRepository.findById(updatedComment.getPostId())
                                    .flatMap(post -> {
                                        post.updateComment(updatedComment);
                                        return postRepository.save(post)
                                                .then(notificationRepository.save(new Notification(post.getUserId(),
                                                        "A comment on your post was updated")))
                                                .thenReturn(updatedComment);
                                    }));
                });
    }

    public Mono<Void> deleteComment(String id) {
        return commentRepository.findById(new ObjectId(id))
                .flatMap(comment -> postRepository.findById(comment.getPostId())
                        .flatMap(post -> {
                            post.removeComment(comment);
                            return postRepository.save(post)
                                    .then(notificationRepository.save(new Notification(post.getUserId(),
                                            "A comment on your post was deleted")))
                                    .then(commentRepository.deleteById(new ObjectId(id)));
                        }));
    }

    public Mono<Comment> getCommentById(String id) {
        return commentRepository.findById(new ObjectId(id));
    }

    public Flux<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(new ObjectId(postId));
    }
}
