package com.example.websocket.service.user;

import com.example.websocket.model.User;
import com.example.websocket.model.user.Block;
import com.example.websocket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserBlockService {

    private static final Logger logger = LoggerFactory.getLogger(UserBlockService.class);
    private final UserRepository userRepository;

    public UserBlockService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Mono<Void> blockUser(String blockerId, String blockedId, String blockerFirstName,
            String blockerLastName) {
        logger.info("User {} blocking user {}", blockerId, blockedId);
        return userRepository.findById(blockerId).flatMap(blocker -> {
            // Vérifier si l'utilisateur est déjà bloqué
            if (blocker.isBlocked(blockedId)) {
                return Mono.error(new IllegalStateException("User is already blocked"));
            }

            Block block = new Block(blockerId, blockedId, blockerFirstName, blockerLastName);
            blocker.blockUser(block);
            return userRepository.save(blocker).then();
        }).doOnError(error -> logger.error("Error blocking user: {}", error.getMessage()));
    }

    public Mono<Void> unblockUser(String blockerId, String blockedId) {
        logger.info("User {} unblocking user {}", blockerId, blockedId);
        return userRepository.findById(blockerId).flatMap(blocker -> {
            blocker.unblockUser(blockedId);
            return userRepository.save(blocker).then();
        }).doOnError(error -> logger.error("Error unblocking user: {}", error.getMessage()));
    }
}
