package by.vstu.zamok.restaurant.exception;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private Instant timestamp;
    private String message;
    private String path;
}
