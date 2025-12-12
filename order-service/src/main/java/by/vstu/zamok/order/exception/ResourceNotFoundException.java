package by.vstu.zamok.order.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // Существующий конструктор
    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Новый конструктор для "оборачивания" исключений
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
