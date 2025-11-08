package by.vstu.zamok.restaurant.mapper;

import by.vstu.zamok.restaurant.dto.DishDto;
import by.vstu.zamok.restaurant.dto.RestaurantDto;
import by.vstu.zamok.restaurant.entity.Dish;
import by.vstu.zamok.restaurant.entity.Restaurant;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-10T20:14:55+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class RestaurantMapperImpl implements RestaurantMapper {

    @Autowired
    private DishMapper dishMapper;

    @Override
    public RestaurantDto toDto(Restaurant entity) {
        if ( entity == null ) {
            return null;
        }

        RestaurantDto restaurantDto = new RestaurantDto();

        restaurantDto.setAddress( entity.getAddress() );
        restaurantDto.setCuisine( entity.getCuisine() );
        restaurantDto.setDishes( dishListToDishDtoList( entity.getDishes() ) );
        restaurantDto.setId( entity.getId() );
        restaurantDto.setName( entity.getName() );

        return restaurantDto;
    }

    @Override
    public Restaurant toEntity(RestaurantDto dto) {
        if ( dto == null ) {
            return null;
        }

        Restaurant restaurant = new Restaurant();

        restaurant.setAddress( dto.getAddress() );
        restaurant.setCuisine( dto.getCuisine() );
        restaurant.setDishes( dishDtoListToDishList( dto.getDishes() ) );
        restaurant.setId( dto.getId() );
        restaurant.setName( dto.getName() );

        return restaurant;
    }

    @Override
    public List<RestaurantDto> toDto(List<Restaurant> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<RestaurantDto> list = new ArrayList<RestaurantDto>( entityList.size() );
        for ( Restaurant restaurant : entityList ) {
            list.add( toDto( restaurant ) );
        }

        return list;
    }

    @Override
    public List<Restaurant> toEntity(List<RestaurantDto> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<Restaurant> list = new ArrayList<Restaurant>( dtoList.size() );
        for ( RestaurantDto restaurantDto : dtoList ) {
            list.add( toEntity( restaurantDto ) );
        }

        return list;
    }

    protected List<DishDto> dishListToDishDtoList(List<Dish> list) {
        if ( list == null ) {
            return null;
        }

        List<DishDto> list1 = new ArrayList<DishDto>( list.size() );
        for ( Dish dish : list ) {
            list1.add( dishMapper.toDto( dish ) );
        }

        return list1;
    }

    protected List<Dish> dishDtoListToDishList(List<DishDto> list) {
        if ( list == null ) {
            return null;
        }

        List<Dish> list1 = new ArrayList<Dish>( list.size() );
        for ( DishDto dishDto : list ) {
            list1.add( dishMapper.toEntity( dishDto ) );
        }

        return list1;
    }
}
