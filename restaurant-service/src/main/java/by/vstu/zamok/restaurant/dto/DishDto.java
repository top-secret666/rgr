package by.vstu.zamok.restaurant.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DishDto {
    private Long id;

    @NotBlank(message = "name must not be blank")
    private String name;
    private String description;

    @Min(value = 0, message = "price must be non-negative")
    private int price;
    private String imageUrl;

    @NotNull(message = "restaurantId must not be null")
    private Long restaurantId;
}
