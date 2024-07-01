# nextstepsocket/Dockerfile
FROM openjdk:11

WORKDIR /app

COPY . .

RUN ./mvnw package

EXPOSE 8080

CMD ["java", "-jar", "target/your-application.jar"]
