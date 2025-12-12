package by.vstu.zamok.order.dto;

import lombok.Data;

// Этот DTO используется для получения ответа от user-service
@Data
public class UserDto {
    private Long id;
    // Нам нужно только поле id, остальные данные пользователя остаются в user-service
}
