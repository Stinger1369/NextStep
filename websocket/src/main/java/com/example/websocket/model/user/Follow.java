package com.example.websocket.model.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "follows")
@Data
@NoArgsConstructor
public class Follow {
    @Id
    private String id;
    private String followerId;
    private String followeeId;
    private String followerFirstName;
    private String followerLastName;

    public Follow(String followerId, String followeeId, String followerFirstName,
            String followerLastName) {
        this.id = UUID.randomUUID().toString();
        this.followerId = followerId;
        this.followeeId = followeeId;
        this.followerFirstName = followerFirstName;
        this.followerLastName = followerLastName;
    }
}
