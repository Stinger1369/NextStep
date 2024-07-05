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
├── Dockerfile
├── build
├── data
│   └── database
│       └── mychat.db
├── dependency-reduced-pom.xml
├── docker-compose.yml
├── logs
├── pom.xml
├── readme.md
├── scripts
│   ├── start.sh
│   └── stop.sh
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── mychat
│   │   │           ├── ChatServer.java
│   │   │           ├── Main.java
│   │   │           ├── config
│   │   │           │   ├── MongoDBConnection.java
│   │   │           │   └── ServerConfig.java
│   │   │           ├── handler
│   │   │           │   ├── AuthHandler.java
│   │   │           │   ├── ChatHandler.java
│   │   │           │   ├── NotificationHandler.java
│   │   │           │   └── WebSocketFrameHandler.java
│   │   │           ├── model
│   │   │           │   ├── Message.java
│   │   │           │   ├── Notification.java
│   │   │           │   └── User.java
│   │   │           ├── service
│   │   │           │   ├── NotificationService.java
│   │   │           │   └── UserService.java
│   │   │           ├── util
│   │   │               ├── EncryptionUtil.java
│   │   │               └── ValidationUtil.java
│   │   └── resources
│   │       └── application.properties
│   └── test
│       └── java
│           └── com
│               └── mychat
│                   ├── AppTest.java
│                   ├── handler
│                   │   └── ChatHandlerTest.java
│                   ├── service
│                   │   └── UserServiceTest.java
│                   └── util
│                       └── EncryptionUtilTest.java
└── target
    ├── classes
    │   ├── application.properties
    │   └── com
    │       └── mychat
    │           ├── ChatServer$1.class
    │           ├── ChatServer.class
    │           ├── Main.class
    │           ├── config
    │           │   └── MongoDBConnection.class
    │           ├── handler
    │           │   ├── AuthHandler.class
    │           │   ├── ChatHandler.class
    │           │   ├── NotificationHandler.class
    │           │   └── WebSocketFrameHandler.class
    │           ├── model
    │           │   └── User.class
    │           ├── service
    │           │   └── UserService.class
    │           └── util
    │               └── EncryptionUtil.class
    ├── generated-sources
    │   └── annotations
    ├── generated-test-sources
    │   └── test-annotations
    ├── maven-archiver
    │   └── pom.properties
    ├── maven-status
    │   └── maven-compiler-plugin
    │       ├── compile
    │       │   └── default-compile
    │       │       ├── createdFiles.lst
    │       │       └── inputFiles.lst
    │       └── testCompile
    │           └── default-testCompile
    │               ├── createdFiles.lst
    │               └── inputFiles.lst
    ├── nextstepsocket-1.0-SNAPSHOT-shaded.jar
    ├── nextstepsocket-1.0-SNAPSHOT.jar
    ├── surefire-reports
    │   ├── TEST-com.mychat.AppTest.xml
    │   └── com.mychat.AppTest.txt
    └── test-classes
        └── com
            └── mychat
                ├── AppTest.class
                ├── handler
                │   └── ChatHandlerTest.class
                ├── service
                └── util

54 directories, 49 files


# NextStep Socket Server

This is a chat server built with Java and Netty for handling real-time communication.

## Structure

- **src/main/java/com/mychat**: Contains the main application code.
- **src/test/java/com/mychat**: Contains test cases.
- **scripts**: Contains scripts to start and stop the server.
- **Dockerfile**: Docker configuration.
- **docker-compose.yml**: Docker Compose configuration.
- **logs**: Directory for log files.
- **data**: Directory for database files.

## How to Run
### Using Maven

```sh
mvn clean install -U
java -jar target/nextstepsocket-1.0-SNAPSHOT-shaded.jar

## avec springboot
mvn clean install -U
mvn spring-boot:run

without test
mvn spring-boot:run -DskipTests

pour docker
docker-compose down
docker-compose up -d


debug full
mvn clean install -X -e
mvn spring-boot:run -X -e



{
  "action": "createUser",
  "data": {
    "username": "testuser1",
    "email": "testuser@example.com",
    "password": "password123"
  }
}

{
  "action": "createPost",
  "data": {
    "title": "My First Post",
    "content": "This is the content of my first post",
    "userId": "6687e109cc6e8e3e2c58e2d4"  // Replace with the correct user ID
  }
}


{
  "action": "createComment",
  "data": {
    "postId": "6687e191cc6e8e3e2c58e2d5", // Replace with the correct post ID
    "userId": "6687e109cc6e8e3e2c58e2d4", // Replace with the correct user ID
    "content": "This is a comment on the first post"
  }
}
