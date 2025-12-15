package by.vstu.zamok.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class RestaurantDto {
    private Long id;

    @NotBlank(message = "name must not be blank")
    private String name;
    private String cuisine;
    private String address;
    private List<DishDto> dishes;
}
