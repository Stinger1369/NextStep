package com.example;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import com.google.gson.Gson;
import org.bson.Document;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;

public class WebSocketFrameHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {
    private MongoClient mongoClient = MongoClients.create();
    private MongoDatabase database = mongoClient.getDatabase("chatdb");
    private Gson gson = new Gson();

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) throws Exception {
        String message = msg.text();
        System.out.println("Received: " + message);

        Document doc = Document.parse(message);
        String action = doc.getString("action");

        switch (action) {
            case "sendMessage":
                handleMessage(doc);
                break;
            case "createGroup":
                handleCreateGroup(doc);
                break;
            // Add more cases for other actions
            default:
                System.out.println("Unknown action: " + action);
                break;
        }
    }

    private void handleMessage(Document doc) {
        MongoCollection<Document> messages = database.getCollection("messages");
        messages.insertOne(doc);
        System.out.println("Message stored: " + doc.toJson());
    }

    private void handleCreateGroup(Document doc) {
        MongoCollection<Document> groups = database.getCollection("groups");
        groups.insertOne(doc);
        System.out.println("Group created: " + doc.toJson());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}
