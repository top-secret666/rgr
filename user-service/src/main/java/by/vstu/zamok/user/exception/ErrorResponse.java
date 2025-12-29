package by.vstu.zamok.user.exception;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private int status;
    private String message;
    private String error;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> errors;
}
