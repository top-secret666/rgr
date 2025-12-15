package by.vstu.zamok.restaurant.mapper;

import by.vstu.zamok.restaurant.dto.RestaurantDto;
import by.vstu.zamok.restaurant.entity.Restaurant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = DishMapper.class)
public interface RestaurantMapper extends BaseMapper<Restaurant, RestaurantDto> {
}
