package by.vstu.zamok.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Size(min = 3, max = 255, message = "fullName length must be between 3 and 255")
    private String fullName;

    @Size(min = 6, max = 255, message = "password length must be at least 6")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
