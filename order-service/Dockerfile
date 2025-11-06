# --- Этап 1: Сборка проекта с помощью Maven ---
# Используем официальный образ Maven с JDK 17 для сборки
FROM maven:3.8.5-openjdk-17-slim AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем pom.xml для кэширования зависимостей
COPY pom.xml .
# Скачиваем все зависимости, чтобы слой кэшировался, если pom.xml не менялся
RUN mvn dependency:go-offline

# Копируем остальной исходный код проекта
COPY src ./src

# Собираем приложение в jar-файл, пропуская тесты
RUN mvn package -DskipTests


# --- Этап 2: Создание легковесного образа для запуска ---
# Используем официальный легковесный образ Eclipse Temurin 17 JRE на базе Alpine
FROM eclipse-temurin:17-jre-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем собранный .jar файл из этапа 'builder'
COPY --from=builder /app/target/order-service-*.jar order-service.jar

# Указываем порт, который будет слушать наше приложение
EXPOSE 8080

# Команда для запуска приложения при старте контейнера
CMD ["java", "-jar", "order-service.jar"]
