package by.vstu.zamok.restaurant.mapper;

import by.vstu.zamok.restaurant.dto.DishDto;
import by.vstu.zamok.restaurant.entity.Dish;
import by.vstu.zamok.restaurant.entity.Restaurant;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T14:09:25+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class DishMapperImpl implements DishMapper {

    @Override
    public DishDto toDto(Dish dish) {
        if ( dish == null ) {
            return null;
        }

        DishDto dishDto = new DishDto();

        dishDto.setRestaurantId( dishRestaurantId( dish ) );
        dishDto.setDescription( dish.getDescription() );
        dishDto.setId( dish.getId() );
        dishDto.setImageUrl( dish.getImageUrl() );
        dishDto.setName( dish.getName() );
        dishDto.setPrice( dish.getPrice() );

        return dishDto;
    }

    @Override
    public Dish toEntity(DishDto dishDto) {
        if ( dishDto == null ) {
            return null;
        }

        Dish dish = new Dish();

        dish.setRestaurant( dishDtoToRestaurant( dishDto ) );
        dish.setDescription( dishDto.getDescription() );
        dish.setId( dishDto.getId() );
        dish.setImageUrl( dishDto.getImageUrl() );
        dish.setName( dishDto.getName() );
        dish.setPrice( dishDto.getPrice() );

        return dish;
    }

    private Long dishRestaurantId(Dish dish) {
        if ( dish == null ) {
            return null;
        }
        Restaurant restaurant = dish.getRestaurant();
        if ( restaurant == null ) {
            return null;
        }
        Long id = restaurant.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected Restaurant dishDtoToRestaurant(DishDto dishDto) {
        if ( dishDto == null ) {
            return null;
        }

        Restaurant restaurant = new Restaurant();

        restaurant.setId( dishDto.getRestaurantId() );

        return restaurant;
    }
}
