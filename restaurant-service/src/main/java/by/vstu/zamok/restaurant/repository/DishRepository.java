package by.vstu.zamok.restaurant.repository;

import by.vstu.zamok.restaurant.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByRestaurantId(Long restaurantId);
}
