package by.vstu.zamok.user.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "email must not be blank")
    @Email(message = "email must be valid")
    private String email;

    @Size(min = 3, max = 255, message = "fullName length must be between 3 and 255")
    private String fullName;

    @NotBlank(message = "password must not be blank")
    @Size(min = 6, max = 255, message = "password length must be at least 6")
    private String password;
}
