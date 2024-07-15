package com.example.websocket.service;

import com.example.websocket.model.Comment;
import com.example.websocket.model.Like;
import com.example.websocket.model.Notification;
import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import com.example.websocket.repository.UserRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final LikeService likeService;

    public PostService(PostRepository postRepository, UserRepository userRepository,
            NotificationService notificationService, LikeService likeService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.likeService = likeService;
    }

    public Mono<Post> createPost(Post post) {
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());

        return userRepository.findById(post.getUserId()).flatMap(user -> {
            post.setUserFirstName(user.getFirstName());
            post.setUserLastName(user.getLastName());
            return postRepository.save(post).flatMap(savedPost -> {
                user.addPost(savedPost);
                return userRepository.save(user).flatMap(updatedUser -> {
                    Notification notification = new Notification(user.getId(), user.getFirstName(),
                            user.getLastName(), "New post created: " + savedPost.getTitle(),
                            savedPost.getContent());
                    return notificationService.createNotification(notification)
                            .flatMap(savedNotification -> {
                                user.addNotification(savedNotification);
                                return userRepository.save(user).thenReturn(savedPost);
                            });
                });
            });
        }).switchIfEmpty(Mono.error(new Exception("Invalid userId")));
    }

    public Mono<Post> addCommentToPost(String postId, Comment comment) {
        return userRepository.findById(comment.getUserId()).flatMap(user -> {
            comment.setFirstName(user.getFirstName());
            comment.setLastName(user.getLastName());
            return postRepository.findById(postId).flatMap(post -> {
                if (post.getComments().stream().noneMatch(c -> c.getId().equals(comment.getId()))) {
                    post.addComment(comment);
                    post.setUpdatedAt(new Date());
                    return postRepository.save(post).flatMap(updatedPost -> {
                        return notifyParticipants(post, comment.getUserId(),
                                "New comment on post: " + post.getTitle(), comment.getContent())
                                        .thenReturn(updatedPost);
                    });
                } else {
                    return Mono.just(post);
                }
            });
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

    public Mono<Void> deletePost(String id, String userId) {
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

    public Mono<Post> likePost(String postId, String userId) {
        return userRepository.findById(userId).flatMap(user -> {
            Like like = new Like(userId, postId, "post", user.getFirstName(), user.getLastName());
            return likeService.likeEntity(like)
                    .flatMap(savedLike -> postRepository.findById(postId).flatMap(post -> {
                        post.addLike(savedLike);
                        return postRepository.save(post);
                    }).flatMap(savedPost -> {
                        return userRepository.findById(userId).flatMap(likeUser -> {
                            likeUser.addLike(savedLike);
                            return userRepository.save(likeUser).thenReturn(savedPost);
                        });
                    }).flatMap(savedPost -> {
                        return userRepository.findById(savedPost.getUserId()).flatMap(postOwner -> {
                            Notification notification =
                                    new Notification(savedPost.getUserId(), user.getFirstName(),
                                            user.getLastName(),
                                            String.format("%s %s liked your post.",
                                                    user.getFirstName(), user.getLastName()),
                                            postId);
                            return notificationService.createNotification(notification)
                                    .flatMap(savedNotification -> {
                                        postOwner.addNotification(savedNotification);
                                        return userRepository.save(postOwner).thenReturn(savedPost);
                                    });
                        });
                    }));
        });
    }

    public Mono<Post> unlikePost(String postId, String userId) {
        return userRepository.findById(userId).flatMap(user -> {
            Like like = new Like(userId, postId, "post", user.getFirstName(), user.getLastName());
            return likeService.unlikeEntity(userId, postId, "post")
                    .flatMap(unused -> postRepository.findById(postId).flatMap(post -> {
                        post.removeLike(like);
                        return postRepository.save(post);
                    }).flatMap(savedPost -> {
                        return userRepository.findById(userId).flatMap(likeUser -> {
                            likeUser.removeLike(like);
                            return userRepository.save(likeUser).thenReturn(savedPost);
                        });
                    }).flatMap(savedPost -> {
                        return userRepository.findById(savedPost.getUserId()).flatMap(postOwner -> {
                            Notification notification =
                                    new Notification(postId, user.getFirstName(),
                                            user.getLastName(),
                                            String.format("%s %s unliked your post.",
                                                    user.getFirstName(), user.getLastName()),
                                            postId);
                            return notificationService.createNotification(notification)
                                    .flatMap(savedNotification -> {
                                        postOwner.addNotification(savedNotification);
                                        return userRepository.save(postOwner).thenReturn(savedPost);
                                    });
                        });
                    }));
        });
    }

    public Mono<Post> sharePost(String postId, String email) {
        return postRepository.findById(postId).flatMap(post -> {
            post.addShare(email);
            return postRepository.save(post).flatMap(savedPost -> {
                Notification notification = new Notification(post.getUserId(),
                        post.getUserFirstName(), post.getUserLastName(),
                        "Your post was shared with: " + email, post.getContent());
                return notificationService.createNotification(notification)
                        .flatMap(savedNotification -> userRepository.findById(post.getUserId())
                                .flatMap(postUser -> {
                                    postUser.addNotification(savedNotification);
                                    return userRepository.save(postUser).thenReturn(savedPost);
                                }));
            });
        });
    }

    public Mono<Post> repostPost(String postId, String userId) {
        return postRepository.findById(postId).flatMap(post -> {
            post.incrementRepostCount();
            post.addReposter(userId);
            return postRepository.save(post).flatMap(savedPost -> {
                Notification notification = new Notification(post.getUserId(),
                        post.getUserFirstName(), post.getUserLastName(),
                        "Your post was reposted by user: " + userId, post.getContent());
                return notificationService.createNotification(notification)
                        .flatMap(savedNotification -> userRepository.findById(post.getUserId())
                                .flatMap(postUser -> {
                                    postUser.addNotification(savedNotification);
                                    return userRepository.save(postUser).thenReturn(savedPost);
                                }));
            });
        });
    }

    private Mono<Void> notifyParticipants(Post post, String senderId, String message,
            String content) {
        Set<String> participantIds = new HashSet<>();
        participantIds.add(post.getUserId());
        participantIds.addAll(
                post.getComments().stream().map(Comment::getUserId).collect(Collectors.toSet()));

        Flux<Notification> notifications = Flux.fromIterable(participantIds).flatMap(
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
                }));

        return notifications.then();
    }
}
