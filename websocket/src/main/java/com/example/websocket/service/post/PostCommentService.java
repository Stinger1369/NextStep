package com.example.websocket.service.post;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import com.example.websocket.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostCommentService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final Logger logger = LoggerFactory.getLogger(PostCommentService.class);

    public PostCommentService(PostRepository postRepository, UserRepository userRepository,
            NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Mono<Post> addCommentToPost(String postId, Comment comment) {
        logger.info("Adding comment to post {}", postId);
        return userRepository.findById(comment.getUserId()).flatMap(user -> {
            comment.setFirstName(user.getFirstName());
            comment.setLastName(user.getLastName());
            return postRepository.findById(postId).flatMap(post -> {
                if (post.getComments().stream().noneMatch(c -> c.getId().equals(comment.getId()))) {
                    post.addComment(comment);
                    post.setUpdatedAt(new Date());
                    return postRepository.save(post)
                            .flatMap(updatedPost -> notifyParticipants(post, comment.getUserId(),
                                    "New comment on post: " + post.getTitle(), comment.getContent())
                                            .thenReturn(updatedPost));
                } else {
                    return Mono.just(post);
                }
            });
        });
    }

    private Mono<Void> notifyParticipants(Post post, String senderId, String message,
            String content) {
        Set<String> participantIds = new HashSet<>();
        participantIds.add(post.getUserId());
        participantIds.addAll(
                post.getComments().stream().map(Comment::getUserId).collect(Collectors.toSet()));

        return Flux.fromIterable(participantIds).flatMap(
                participantId -> userRepository.findById(participantId).flatMap(participant -> {
                    if (!participantId.equals(senderId)) {
                        Notification notification =
                                new Notification(participant.getId(), participant.getFirstName(),
                                        participant.getLastName(), message, content);
                        return notificationService.createNotification(notification)
                                .flatMap(savedNotification -> {
                                    participant.addNotification(savedNotification);
                                    return userRepository.save(participant)
                                            .thenReturn(savedNotification);
                                });
                    } else {
                        return Mono.empty();
                    }
                })).then();
    }
}
