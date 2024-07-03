package com.example.mychat.controller;

import com.example.mychat.dto.CommentDTO;
import com.example.mychat.model.Comment;
import com.example.mychat.model.Notification;
import com.example.mychat.service.CommentService;
import com.example.mychat.service.NotificationService;
import com.example.mychat.service.PostService;
import com.example.mychat.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final PostService postService;
    private final NotificationService notificationService;
    private final CommentService commentService;
    private final UserService userService;

    @Autowired
    public CommentController(PostService postService, NotificationService notificationService,
            CommentService commentService, UserService userService) {
        this.postService = postService;
        this.notificationService = notificationService;
        this.commentService = commentService;
        this.userService = userService;
    }

    @PostMapping("/post/{postId}")
    public Mono<ServerResponse> createComment(@PathVariable String postId, @RequestBody CommentDTO commentDTO) {
        Comment comment = new Comment(commentDTO.getContent(), commentDTO.getAuthorId(), new ObjectId(postId));
        return commentService.createComment(comment)
                .flatMap(savedComment -> postService.getPostById(postId)
                        .flatMap(post -> {
                            post.addComment(savedComment);
                            return postService.updatePost(postId, post)
                                    .flatMap(updatedPost -> userService.getUserById(savedComment.getAuthorId())
                                            .flatMap(user -> {
                                                user.addComment(savedComment);
                                                return userService.updateUser(user.getId().toHexString(), user)
                                                        .flatMap(updatedUser -> {
                                                            Notification notification = new Notification(
                                                                    updatedPost.getUserId(),
                                                                    "New comment on your post");
                                                            return notificationService.createNotification(notification)
                                                                    .flatMap(notif -> {
                                                                        return userService
                                                                                .getUserById(notif.getUserId())
                                                                                .flatMap(notificationUser -> {
                                                                                    notificationUser
                                                                                            .addNotification(notif);
                                                                                    return userService.updateUser(
                                                                                            notificationUser.getId()
                                                                                                    .toHexString(),
                                                                                            notificationUser);
                                                                                });
                                                                    })
                                                                    .then(ServerResponse.ok().bodyValue(savedComment));
                                                        });
                                            }));
                        }))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @PutMapping("/{commentId}")
    public Mono<ServerResponse> updateComment(@PathVariable String commentId, @RequestBody CommentDTO commentDTO) {
        return commentService.getCommentById(commentId)
                .flatMap(existingComment -> {
                    existingComment.setContent(commentDTO.getContent());
                    existingComment.setAuthorId(commentDTO.getAuthorId());
                    existingComment.setPostId(new ObjectId(commentDTO.getPostId()));
                    return commentService.updateComment(commentId, existingComment)
                            .flatMap(updatedComment -> postService.getPostById(updatedComment.getPostId().toHexString())
                                    .flatMap(post -> {
                                        post.updateComment(updatedComment);
                                        return postService.updatePost(post.getId().toHexString(), post)
                                                .flatMap(updatedPost -> {
                                                    Notification notification = new Notification(post.getUserId(),
                                                            "A comment on your post was updated");
                                                    return notificationService.createNotification(notification)
                                                            .flatMap(notif -> {
                                                                return userService.getUserById(notif.getUserId())
                                                                        .flatMap(notificationUser -> {
                                                                            notificationUser.addNotification(notif);
                                                                            return userService.updateUser(
                                                                                    notificationUser.getId()
                                                                                            .toHexString(),
                                                                                    notificationUser);
                                                                        });
                                                            })
                                                            .then(ServerResponse.ok().bodyValue(updatedComment));
                                                });
                                    }));
                })
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @DeleteMapping("/{commentId}")
    public Mono<ServerResponse> deleteComment(@PathVariable String commentId) {
        return commentService.getCommentById(commentId)
                .flatMap(comment -> postService.getPostById(comment.getPostId().toHexString())
                        .flatMap(post -> {
                            post.removeComment(comment);
                            return postService.updatePost(post.getId().toHexString(), post)
                                    .flatMap(updatedPost -> commentService.deleteComment(commentId)
                                            .then(ServerResponse.noContent().build())
                                            .flatMap(response -> {
                                                Notification notification = new Notification(post.getUserId(),
                                                        "A comment on your post was deleted");
                                                return notificationService.createNotification(notification)
                                                        .flatMap(notif -> {
                                                            return userService.getUserById(notif.getUserId())
                                                                    .flatMap(notificationUser -> {
                                                                        notificationUser.addNotification(notif);
                                                                        return userService.updateUser(
                                                                                notificationUser.getId().toHexString(),
                                                                                notificationUser);
                                                                    });
                                                        })
                                                        .then(ServerResponse.noContent().build());
                                            }));
                        }))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    @GetMapping("/post/{postId}")
    public Mono<ServerResponse> getCommentsByPostId(@PathVariable String postId) {
        return commentService.getCommentsByPostId(postId)
                .collectList()
                .flatMap(comments -> ServerResponse.ok().bodyValue(comments))
                .switchIfEmpty(ServerResponse.notFound().build());
    }
}
