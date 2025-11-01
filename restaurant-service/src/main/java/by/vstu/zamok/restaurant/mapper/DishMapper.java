package by.vstu.zamok.restaurant.mapper;

import by.vstu.zamok.restaurant.dto.DishDto;
import by.vstu.zamok.restaurant.entity.Dish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DishMapper {

    @Mapping(source = "restaurant.id", target = "restaurantId")
    DishDto toDto(Dish dish);

    @Mapping(source = "restaurantId", target = "restaurant.id")
    Dish toEntity(DishDto dishDto);
}
