package by.vstu.zamok.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressDto {
    private Long id;

    @NotBlank(message = "street must not be blank")
    private String street;
    @NotBlank(message = "city must not be blank")
    private String city;
    private String zip;
    private String state;
    private String country;
}
