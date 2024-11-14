FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY ../dashboard-service/pom.xml .
COPY ../dashboard-service/src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
