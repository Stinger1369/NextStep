package com.example.websocket.handler.user;

import com.example.websocket.service.UserService;
import com.example.websocket.handler.WebSocketErrorHandler;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class BlockHandler {

    private static final Logger logger = LoggerFactory.getLogger(BlockHandler.class);
    private static final String BLOCKER_ID = "blockerId";
    private static final String BLOCKED_ID = "blockedId";
    private static final String BLOCKER_FIRST_NAME = "blockerFirstName";
    private static final String BLOCKER_LAST_NAME = "blockerLastName";

    private final UserService userService;

    public BlockHandler(UserService userService) {
        this.userService = userService;
    }

    public void handleBlockUser(WebSocketSession session, JsonNode payload) {
        logger.info("Handling user.block with payload: {}", payload);

        if (payload.hasNonNull(BLOCKER_ID) && payload.hasNonNull(BLOCKED_ID)
                && payload.hasNonNull(BLOCKER_FIRST_NAME)
                && payload.hasNonNull(BLOCKER_LAST_NAME)) {
            String blockerId = payload.get(BLOCKER_ID).asText();
            String blockedId = payload.get(BLOCKED_ID).asText();
            String blockerFirstName = payload.get(BLOCKER_FIRST_NAME).asText();
            String blockerLastName = payload.get(BLOCKER_LAST_NAME).asText();

            logger.info("User with blockerId: {} is blocking user with blockedId: {}", blockerId,
                    blockedId);
            userService.blockUser(blockerId, blockedId, blockerFirstName, blockerLastName)
                    .subscribe(unused -> {
                        WebSocketErrorHandler.sendMessage(session, "user.block.success", null);
                        logger.info("User with blockerId: {} blocked user with blockedId: {}",
                                blockerId, blockedId);
                    }, error -> {
                        logger.error("Error blocking user with blockerId: {} and blockedId: {}",
                                blockerId, blockedId, error);
                        WebSocketErrorHandler.sendErrorMessage(session, "Error blocking user",
                                error);
                    });
        } else {
            logger.error("Missing fields in user.block payload: blockerId={}, blockedId={}",
                    payload.hasNonNull(BLOCKER_ID), payload.hasNonNull(BLOCKED_ID));
            WebSocketErrorHandler.sendErrorMessage(session, "Missing fields in user.block payload");
        }
    }

    public void handleUnblockUser(WebSocketSession session, JsonNode payload) {
        logger.info("Handling user.unblock with payload: {}", payload);

        if (payload.hasNonNull(BLOCKER_ID) && payload.hasNonNull(BLOCKED_ID)) {
            String blockerId = payload.get(BLOCKER_ID).asText();
            String blockedId = payload.get(BLOCKED_ID).asText();

            logger.info("User with blockerId: {} is unblocking user with blockedId: {}", blockerId,
                    blockedId);
            userService.unblockUser(blockerId, blockedId).subscribe(unused -> {
                WebSocketErrorHandler.sendMessage(session, "user.unblock.success", null);
                logger.info("User with blockerId: {} unblocked user with blockedId: {}", blockerId,
                        blockedId);
            }, error -> {
                logger.error("Error unblocking user with blockerId: {} and blockedId: {}",
                        blockerId, blockedId, error);
                WebSocketErrorHandler.sendErrorMessage(session, "Error unblocking user", error);
            });
        } else {
            logger.error("Missing fields in user.unblock payload: blockerId={}, blockedId={}",
                    payload.hasNonNull(BLOCKER_ID), payload.hasNonNull(BLOCKED_ID));
            WebSocketErrorHandler.sendErrorMessage(session,
                    "Missing fields in user.unblock payload");
        }
    }
}
