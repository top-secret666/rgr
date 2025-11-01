package by.vstu.zamok.user.payload.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
