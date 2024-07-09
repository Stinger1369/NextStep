websocket
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── websocket
│   │   │               ├── WebSocketApplication.java
│   │   │               ├── config
│   │   │               │   └── WebSocketConfig.java
│   │   │               ├── handler
│   │   │               │   ├── ChatWebSocketHandler.java
│   │   │               │   └── UserWebSocketHandler.java
│   │   │               ├── model
│   │   │               │   ├── Comment.java
│   │   │               │   ├── Conversation.java
│   │   │               │   ├── Notification.java
│   │   │               │   ├── Post.java
│   │   │               │   └── User.java
│   │   │               ├── repository
│   │   │               │   ├── CommentRepository.java
│   │   │               │   ├── ConversationRepository.java
│   │   │               │   ├── NotificationRepository.java
│   │   │               │   ├── PostRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               └── service
│   │   │                   ├── CommentService.java
│   │   │                   ├── ConversationService.java
│   │   │                   ├── NotificationService.java
│   │   │                   ├── PostService.java
│   │   │                   └── UserService.java
│   ├── resources
│   │   ├── application.properties
│   │   └── static
│   │       └── index.html
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── websocket
│                       └── WebSocketApplicationTests.java
└── pom.xml


mvn clean install -U
mvn spring-boot:run -U