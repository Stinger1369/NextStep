package com.example.websocket.service;

import com.example.websocket.model.Like;
import com.example.websocket.model.Unlike;
import com.example.websocket.repository.LikeRepository;
import com.example.websocket.repository.UnlikeRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UnlikeRepository unlikeRepository;

    public LikeService(LikeRepository likeRepository, UnlikeRepository unlikeRepository) {
        this.likeRepository = likeRepository;
        this.unlikeRepository = unlikeRepository;
    }

    public Mono<Like> likeEntity(Like like) {
        return unlikeRepository.findByUserIdAndEntityIdAndEntityType(like.getUserId(), like.getEntityId(), like.getEntityType())
                .flatMap(existingUnlike -> unlikeRepository.delete(existingUnlike))
                .then(likeRepository.save(like));
    }

    public Mono<Void> unlikeEntity(String userId, String entityId, String entityType) {
        return likeRepository.findByUserIdAndEntityIdAndEntityType(userId, entityId, entityType)
                .flatMap(existingLike -> likeRepository.delete(existingLike));
    }

    public Mono<Boolean> hasLikedEntity(String userId, String entityId, String entityType) {
        return likeRepository.findByUserIdAndEntityIdAndEntityType(userId, entityId, entityType)
                .map(like -> true).defaultIfEmpty(false);
    }
}
