package by.vstu.zamok.restaurant.service;

import by.vstu.zamok.restaurant.dto.RestaurantDto;
import by.vstu.zamok.restaurant.entity.Restaurant;
import by.vstu.zamok.restaurant.mapper.RestaurantMapper;
import by.vstu.zamok.restaurant.repository.RestaurantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;





@AllArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    public List<RestaurantDto> findAll() {
        return restaurantMapper.toDto(restaurantRepository.findAll());
    }

    public RestaurantDto findById(Long id) {
        return restaurantMapper.toDto(restaurantRepository.findById(id).orElse(null));
    }

    public RestaurantDto save(RestaurantDto restaurant) {
        Restaurant entity = restaurantMapper.toEntity(restaurant);
        return restaurantMapper.toDto(restaurantRepository.save(entity));
    }

    public void deleteById(Long id) {
        restaurantRepository.deleteById(id);
    }

    public List<RestaurantDto> findByName(String name) {
        return restaurantMapper.toDto(restaurantRepository.findAllByNameContainingIgnoreCase(name));
    }
}