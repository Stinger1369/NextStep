package com.example.websocket.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.example.websocket.handler.user.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class UserWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserWebSocketHandler.class);

    private final UserCreationHandler userCreationHandler;
    private final UserCheckHandler userCheckHandler;
    private final UserLikeHandler userLikeHandler;
    private final UserUnlikeHandler userUnlikeHandler;
    private final UserFetchHandler userFetchHandler;
    private final FriendRequestHandler friendRequestHandler;
    private final ProfileVisitHandler profileVisitHandler;
    private final FollowHandler followHandler;
    private final BlockHandler blockHandler;

    public UserWebSocketHandler(UserCreationHandler userCreationHandler,
            UserCheckHandler userCheckHandler, UserLikeHandler userLikeHandler,
            UserUnlikeHandler userUnlikeHandler, UserFetchHandler userFetchHandler,
            FriendRequestHandler friendRequestHandler, ProfileVisitHandler profileVisitHandler,
            FollowHandler followHandler, BlockHandler blockHandler) {
        this.userCreationHandler = userCreationHandler;
        this.userCheckHandler = userCheckHandler;
        this.userLikeHandler = userLikeHandler;
        this.userUnlikeHandler = userUnlikeHandler;
        this.userFetchHandler = userFetchHandler;
        this.friendRequestHandler = friendRequestHandler;
        this.profileVisitHandler = profileVisitHandler;
        this.followHandler = followHandler;
        this.blockHandler = blockHandler;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "user.create":
                userCreationHandler.handleUserCreate(session, payload);
                break;
            case "user.check":
                userCheckHandler.handleUserCheck(session, payload);
                break;
            case "user.getById":
                userFetchHandler.handleGetUserById(session, payload);
                break;
            case "user.getCurrent":
                userFetchHandler.handleGetCurrentUser(session, payload);
                break;
            case "user.like":
                userLikeHandler.handleUserLike(session, payload);
                break;
            case "user.unlike":
                userUnlikeHandler.handleUserUnlike(session, payload);
                break;
            case "friend.request":
                friendRequestHandler.handleSendFriendRequest(session, payload);
                break;
            case "friend.request.accept":
                friendRequestHandler.handleAcceptFriendRequest(session, payload);
                break;
            case "friend.request.decline":
                friendRequestHandler.handleDeclineFriendRequest(session, payload);
                break;
            case "friend.remove":
                friendRequestHandler.handleRemoveFriend(session, payload);
                break;
            case "profile.visit":
                profileVisitHandler.handleProfileVisit(session, payload);
                break;
            case "user.follow":
                followHandler.handleFollowUser(session, payload);
                break;
            case "user.unfollow":
                followHandler.handleUnfollowUser(session, payload);
                break;
            case "user.block":
                blockHandler.handleBlockUser(session, payload);
                break;
            case "user.unblock":
                blockHandler.handleUnblockUser(session, payload);
                break;
            default:
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown user message type: " + messageType);
        }
    }
}
