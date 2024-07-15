package com.example.websocket.service;

import com.example.websocket.model.Like;
import com.example.websocket.repository.LikeRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class LikeService {

    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public Mono<Like> likeEntity(Like like) {
        return likeRepository.save(like);
    }

    public Mono<Void> unlikeEntity(String userId, String entityId, String entityType) {
        return likeRepository.findByUserIdAndEntityIdAndEntityType(userId, entityId, entityType)
                .flatMap(likeRepository::delete);
    }

    public Mono<Boolean> hasLikedEntity(String userId, String entityId, String entityType) {
        return likeRepository.findByUserIdAndEntityIdAndEntityType(userId, entityId, entityType)
                .map(like -> true).defaultIfEmpty(false);
    }
}
