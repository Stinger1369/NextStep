nextstepsocket/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           ├── App.java
│   │   │           ├── MongoDBConnection.java
│   │   │           ├── NettyServer.java
│   │   │           ├── SimpleChannelHandler.java
│   │   │           └── WebSocketFrameHandler.java
│   │   └── resources/
│   ├── test/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── AppTest.java
│   │   └── resources/
└── target/


nextstepsocket/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── mychat/
│   │   │           ├── config/
│   │   │           │   ├── ServerConfig.java
│   │   │           ├── handler/
│   │   │           │   ├── ChatHandler.java
│   │   │           │   ├── NotificationHandler.java
│   │   │           │   └── AuthHandler.java
│   │   │           ├── model/
│   │   │           │   ├── User.java
│   │   │           │   ├── Message.java
│   │   │           │   └── Notification.java
│   │   │           ├── service/
│   │   │           │   ├── UserService.java
│   │   │           │   ├── ChatService.java
│   │   │           │   └── NotificationService.java
│   │   │           ├── util/
│   │   │           │   ├── EncryptionUtil.java
│   │   │           │   └── ValidationUtil.java
│   │   │           ├── ChatServer.java
│   │   │           └── Main.java
│   │   └── resources/
│   │       └── application.properties
│   ├── test/
│   │   └── java/
│   │       └── com/
│   │           └── mychat/
│   │               ├── handler/
│   │               │   └── ChatHandlerTest.java
│   │               ├── service/
│   │               │   └── UserServiceTest.java
│   │               └── util/
│   │                   └── EncryptionUtilTest.java
├── build/
├── logs/
├── data/
│   └── database/
│       └── mychat.db
├── scripts/
│   ├── start.sh
│   └── stop.sh
├── Dockerfile
├── docker-compose.yml
├── README.md
└── pom.xml
