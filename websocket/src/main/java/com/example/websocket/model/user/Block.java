package com.example.websocket.model.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "blocks")
@Data
@NoArgsConstructor
public class Block {
    @Id
    private String id;
    private String blockerId;
    private String blockedId;
    private String blockerFirstName;
    private String blockerLastName;

    public Block(String blockerId, String blockedId, String blockerFirstName,
            String blockerLastName) {
        this.id = UUID.randomUUID().toString();
        this.blockerId = blockerId;
        this.blockedId = blockedId;
        this.blockerFirstName = blockerFirstName;
        this.blockerLastName = blockerLastName;
    }
}
