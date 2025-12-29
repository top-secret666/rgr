package by.vstu.zamok.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private Long id;

    @NotBlank(message = "email must not be blank")
    @Email(message = "email must be valid")
    private String email;

    @Size(min = 3, max = 255, message = "fullName length must be between 3 and 255")
    private String fullName;

    @NotBlank(message = "password must not be blank")
    @Size(min = 6, max = 255, message = "password length must be at least 6")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private Set<AddressDto> addresses;
    private Set<String> roles;
}
