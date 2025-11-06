
FROM maven:3.8.5-openjdk-17-slim AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn package -DskipTests


FROM openjdk:17-jre-slim

WORKDIR /app

COPY --from=builder /app/target/order-service-*.jar order-service.jar

EXPOSE 8080

CMD ["java", "-jar", "order-service.jar"]
