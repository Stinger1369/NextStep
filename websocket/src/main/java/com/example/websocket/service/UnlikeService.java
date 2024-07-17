package com.example.websocket.service;

import com.example.websocket.model.Unlike;
import com.example.websocket.model.Like;
import com.example.websocket.repository.UnlikeRepository;
import com.example.websocket.repository.LikeRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UnlikeService {

    private final UnlikeRepository unlikeRepository;
    private final LikeRepository likeRepository;

    public UnlikeService(UnlikeRepository unlikeRepository, LikeRepository likeRepository) {
        this.unlikeRepository = unlikeRepository;
        this.likeRepository = likeRepository;
    }

    public Mono<Unlike> unlikeEntity(Unlike unlike) {
        return likeRepository
                .findByUserIdAndEntityIdAndEntityType(unlike.getUserId(), unlike.getEntityId(),
                        unlike.getEntityType())
                .flatMap(existingLike -> likeRepository.delete(existingLike))
                .then(unlikeRepository.save(unlike));
    }

    public Mono<Void> removeUnlike(String userId, String entityId, String entityType) {
        return unlikeRepository.findByUserIdAndEntityIdAndEntityType(userId, entityId, entityType)
                .flatMap(existingUnlike -> unlikeRepository.delete(existingUnlike));
    }

    public Mono<Boolean> hasUnlikedEntity(String userId, String entityId, String entityType) {
        return unlikeRepository.findByUserIdAndEntityIdAndEntityType(userId, entityId, entityType)
                .map(unlike -> true).defaultIfEmpty(false);
    }
}
