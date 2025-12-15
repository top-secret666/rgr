FROM maven:3.8.5-openjdk-17-slim AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn package -DskipTests

FROM openjdk:17-slim

WORKDIR /app

COPY --from=builder /app/target/restaurant-service-*.jar restaurant-service.jar

EXPOSE 8081

CMD ["java", "-jar", "restaurant-service.jar"]
