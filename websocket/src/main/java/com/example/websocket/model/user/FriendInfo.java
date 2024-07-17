package com.example.websocket.model.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendInfo {
    private String id;
    private String firstName;
    private String lastName;
}
