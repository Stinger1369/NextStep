package com.example.websocket.handler;

import com.example.websocket.handler.post.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class PostWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(PostWebSocketHandler.class);

    private final PostCreateHandler postCreateHandler;
    private final PostFetchHandler postFetchHandler;
    private final PostUpdateHandler postUpdateHandler;
    private final PostDeleteHandler postDeleteHandler;
    private final PostLikeHandler postLikeHandler;
    private final PostUnlikeHandler postUnlikeHandler;
    private final PostShareHandler postShareHandler;
    private final PostRepostHandler postRepostHandler;

    public PostWebSocketHandler(PostCreateHandler postCreateHandler,
            PostFetchHandler postFetchHandler, PostUpdateHandler postUpdateHandler,
            PostDeleteHandler postDeleteHandler, PostLikeHandler postLikeHandler,
            PostUnlikeHandler postUnlikeHandler, PostShareHandler postShareHandler,
            PostRepostHandler postRepostHandler) {
        this.postCreateHandler = postCreateHandler;
        this.postFetchHandler = postFetchHandler;
        this.postUpdateHandler = postUpdateHandler;
        this.postDeleteHandler = postDeleteHandler;
        this.postLikeHandler = postLikeHandler;
        this.postUnlikeHandler = postUnlikeHandler;
        this.postShareHandler = postShareHandler;
        this.postRepostHandler = postRepostHandler;
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "post.create":
                postCreateHandler.handlePostCreate(session, payload);
                break;
            case "post.getById":
                postFetchHandler.handleGetPost(session, payload);
                break;
            case "post.getAll":
                postFetchHandler.handleGetAllPosts(session);
                break;
            case "post.delete":
                postDeleteHandler.handleDeletePost(session, payload);
                break;
            case "post.update":
                postUpdateHandler.handleUpdatePost(session, payload);
                break;
            case "post.like":
                postLikeHandler.handleLikePost(session, payload);
                break;
            case "post.unlike":
                postUnlikeHandler.handleUnlikePost(session, payload);
                break;
            case "post.share":
                postShareHandler.handleSharePost(session, payload);
                break;
            case "post.repost":
                postRepostHandler.handleRepostPost(session, payload);
                break;
            default:
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown post message type: " + messageType);
        }
    }
}
