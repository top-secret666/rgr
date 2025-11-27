package by.vstu.zamok.user.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private Set<AddressDto> addresses;
    private Set<String> roles;
}
