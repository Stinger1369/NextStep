package com.example.mychat.service;

import com.example.mychat.model.Comment;
import com.example.mychat.model.Notification;
import com.example.mychat.repository.CommentRepository;
import com.example.mychat.repository.NotificationRepository;
import com.example.mychat.repository.PostRepository;
import com.example.mychat.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public Mono<Comment> createComment(Comment comment) {
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(new Date());
        return postRepository.findById(comment.getPostId())
                .flatMap(post -> {
                    post.addComment(comment);
                    return postRepository.save(post)
                            .then(commentRepository.save(comment))
                            .flatMap(savedComment -> userRepository.findById(new ObjectId(post.getUserId()))
                                    .flatMap(user -> {
                                        user.getPosts().forEach(p -> {
                                            if (p.getId().equals(post.getId())) {
                                                p.addComment(savedComment);
                                            }
                                        });
                                        return userRepository.save(user);
                                    })
                                    .then(notificationRepository.save(new Notification(post.getUserId(), "New comment on your post")))
                                    .thenReturn(savedComment));
                });
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
                                                .flatMap(savedPost -> userRepository.findById(new ObjectId(post.getUserId()))
                                                        .flatMap(user -> {
                                                            user.getPosts().forEach(p -> {
                                                                if (p.getId().equals(post.getId())) {
                                                                    p.updateComment(updatedComment);
                                                                }
                                                            });
                                                            return userRepository.save(user);
                                                        })
                                                        .then(notificationRepository.save(new Notification(post.getUserId(), "A comment on your post was updated")))
                                                        .thenReturn(updatedComment));
                                    }));
                });
    }

    public Mono<Void> deleteComment(String id) {
        return commentRepository.findById(new ObjectId(id))
                .flatMap(comment -> postRepository.findById(comment.getPostId())
                        .flatMap(post -> {
                            post.removeComment(comment);
                            return postRepository.save(post)
                                    .flatMap(savedPost -> userRepository.findById(new ObjectId(post.getUserId()))
                                            .flatMap(user -> {
                                                user.getPosts().forEach(p -> {
                                                    if (p.getId().equals(post.getId())) {
                                                        p.removeComment(comment);
                                                    }
                                                });
                                                return userRepository.save(user);
                                            })
                                            .then(notificationRepository.save(new Notification(post.getUserId(), "A comment on your post was deleted")))
                                            .then(commentRepository.deleteById(new ObjectId(id))));
                        }));
    }

    public Mono<Comment> getCommentById(String id) {
        return commentRepository.findById(new ObjectId(id));
    }

    public Flux<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(new ObjectId(postId));
    }
}
