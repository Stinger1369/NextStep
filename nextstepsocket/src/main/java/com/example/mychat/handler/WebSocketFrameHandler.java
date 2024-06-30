package com.example.mychat.handler;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebSocketFrameHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {
  private static final Logger logger = LoggerFactory.getLogger(WebSocketFrameHandler.class);
  private MongoClient mongoClient = MongoClients.create();
  private MongoDatabase database = mongoClient.getDatabase("chatdb");

  @Override
  protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) {
    String message = msg.text();
    logger.info("Received: {}", message);

    Document doc = Document.parse(message);
    String action = doc.getString("action");

    switch (action) {
      case "sendMessage":
        handleMessage(doc);
        break;
      case "createGroup":
        handleCreateGroup(doc);
        break;
      default:
        logger.warn("Unknown action: {}", action);
        break;
    }
  }

  private void handleMessage(Document doc) {
    MongoCollection<Document> messages = database.getCollection("messages");
    messages.insertOne(doc);
    if (logger.isInfoEnabled()) {
      logger.info("Message stored: {}", doc.toJson());
    }
  }

  private void handleCreateGroup(Document doc) {
    MongoCollection<Document> groups = database.getCollection("groups");
    groups.insertOne(doc);
    if (logger.isInfoEnabled()) {
      logger.info("Group created: {}", doc.toJson());
    }
  }

  @Override
  public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    logger.error("Exception caught: ", cause);
    ctx.close();
  }
}
