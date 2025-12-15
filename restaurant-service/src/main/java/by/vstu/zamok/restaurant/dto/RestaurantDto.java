package by.vstu.zamok.restaurant.dto;

import lombok.Data;

import java.util.List;

@Data
public class RestaurantDto {
    private Long id;
    private String name;
    private String cuisine;
    private String address;
    private List<DishDto> dishes;
}
