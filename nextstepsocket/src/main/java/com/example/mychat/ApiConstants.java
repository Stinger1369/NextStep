package com.example.mychat;

public final class ApiConstants {
    public static final String MESSAGES = "/messages";
    public static final String MESSAGES_ID = "/messages/{id}";
    public static final String NOTIFICATIONS = "/notifications";
    public static final String NOTIFICATIONS_ID = "/notifications/{id}";

    private ApiConstants() {
        // Empêche l'instanciation
    }
}
