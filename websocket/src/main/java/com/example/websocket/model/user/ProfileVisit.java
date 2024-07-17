package com.example.websocket.model.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.UUID;

@Document(collection = "profile_visits")
@Data
@NoArgsConstructor
public class ProfileVisit {
    @Id
    private String id;
    private String visitorId;
    private String visitorFirstName;
    private String visitorLastName;
    private Date visitedAt;

    public ProfileVisit(String visitorId, String visitorFirstName, String visitorLastName) {
        this.id = UUID.randomUUID().toString();
        this.visitorId = visitorId;
        this.visitorFirstName = visitorFirstName;
        this.visitorLastName = visitorLastName;
        this.visitedAt = new Date();
    }
}
