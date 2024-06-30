package com.example.mychat.handler;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import com.mongodb.reactivestreams.client.MongoCollection;
import com.mongodb.reactivestreams.client.MongoDatabase;
import com.mongodb.client.result.InsertOneResult;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

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
    MongoCollection<Document> messages = database.getCollection("messages", Document.class);
    messages.insertOne(doc).subscribe(new Subscriber<InsertOneResult>() {
      @Override
      public void onSubscribe(Subscription s) {
        s.request(Long.MAX_VALUE);
      }

      @Override
      public void onNext(InsertOneResult result) {
        logger.info("Message stored: {}", doc.toJson());
      }

      @Override
      public void onError(Throwable t) {
        logger.error("Failed to store message", t);
      }

      @Override
      public void onComplete() {
        // Méthode vide intentionnellement
      }
    });
  }

  private void handleCreateGroup(Document doc) {
    MongoCollection<Document> groups = database.getCollection("groups", Document.class);
    groups.insertOne(doc).subscribe(new Subscriber<InsertOneResult>() {
      @Override
      public void onSubscribe(Subscription s) {
        s.request(Long.MAX_VALUE);
      }

      @Override
      public void onNext(InsertOneResult result) {
        logger.info("Group created: {}", doc.toJson());
      }

      @Override
      public void onError(Throwable t) {
        logger.error("Failed to create group", t);
      }

      @Override
      public void onComplete() {
        // Méthode vide intentionnellement
      }
    });
  }

  @Override
  public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    logger.error("Exception caught: ", cause);
    ctx.close();
  }
}
