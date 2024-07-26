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
les 2 commande en une seule = mvn clean install -Pstart




scp /mnt/h/NextStep/websocket.rar ubuntu@135.125.244.65:~


ssh ubuntu@135.125.244.65
sudo apt-get update
sudo apt-get install unrar
unrar x websocket.rar
cd websocket
mvn clean package
nohup java -jar target/websocket-0.0.1-SNAPSHOT.jar > websocket.log 2>&1 &
