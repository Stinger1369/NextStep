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
    private final PostImageHandler postImageHandler; // Nouveau handler

    public PostWebSocketHandler(PostCreateHandler postCreateHandler,
            PostFetchHandler postFetchHandler, PostUpdateHandler postUpdateHandler,
            PostDeleteHandler postDeleteHandler, PostLikeHandler postLikeHandler,
            PostUnlikeHandler postUnlikeHandler, PostShareHandler postShareHandler,
            PostRepostHandler postRepostHandler, PostImageHandler postImageHandler) { // Ajout du
                                                                                      // postImageHandler
        this.postCreateHandler = postCreateHandler;
        this.postFetchHandler = postFetchHandler;
        this.postUpdateHandler = postUpdateHandler;
        this.postDeleteHandler = postDeleteHandler;
        this.postLikeHandler = postLikeHandler;
        this.postUnlikeHandler = postUnlikeHandler;
        this.postShareHandler = postShareHandler;
        this.postRepostHandler = postRepostHandler;
        this.postImageHandler = postImageHandler; // Initialisation du postImageHandler
    }

    public void handleMessage(WebSocketSession session, String messageType, JsonNode payload) {
        logger.info("Handling message of type: {}", messageType);
        switch (messageType) {
            case "post.create":
                logger.info("Invoking create post handler");
                postCreateHandler.handlePostCreate(session, payload);
                break;
            case "post.getById":
                logger.info("Invoking get post by ID handler");
                postFetchHandler.handleGetPost(session, payload);
                break;
            case "post.getAll":
                logger.info("Invoking get all posts handler");
                postFetchHandler.handleGetAllPosts(session);
                break;
            case "post.delete":
                logger.info("Invoking delete post handler");
                postDeleteHandler.handleDeletePost(session, payload);
                break;
            case "post.update":
                logger.info("Invoking update post handler");
                postUpdateHandler.handleUpdatePost(session, payload);
                break;
            case "post.like":
                logger.info("Invoking like post handler");
                postLikeHandler.handleLikePost(session, payload);
                break;
            case "post.unlike":
                logger.info("Invoking unlike post handler");
                postUnlikeHandler.handleUnlikePost(session, payload);
                break;
            case "post.share":
                logger.info("Invoking share post handler");
                postShareHandler.handleSharePost(session, payload);
                break;
            case "post.repost":
                logger.info("Invoking repost post handler");
                postRepostHandler.handleRepostPost(session, payload);
                break;
            case "post.addImage": // Nouveau case pour l'ajout d'images
                logger.info("Invoking add image to post handler");
                postImageHandler.handleAddImageToPost(session, payload);
                break;
            default:
                logger.warn("Unknown post message type: {}", messageType);
                WebSocketErrorHandler.sendErrorMessage(session,
                        "Unknown post message type: " + messageType);
        }
    }
}
