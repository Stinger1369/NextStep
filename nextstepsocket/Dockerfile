# nextstepsocket/Dockerfile

FROM openjdk:17-slim
VOLUME /tmp
COPY target/nextstepsocket-1.0-SNAPSHOT-shaded.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
