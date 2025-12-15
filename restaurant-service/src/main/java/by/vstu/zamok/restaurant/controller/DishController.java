package by.vstu.zamok.restaurant.controller;

import by.vstu.zamok.restaurant.dto.DishDto;
import by.vstu.zamok.restaurant.service.DishService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
   @RequestMapping("/api/restaurants/{restaurantId}/dishes")
@AllArgsConstructor
public class DishController {
    private final DishService dishService;

    @GetMapping
    public List<DishDto> getAllDishesForRestaurant(@PathVariable Long restaurantId) {
        return dishService.findByRestaurantId(restaurantId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DishDto createDish(@RequestBody DishDto dishDto) {
        return dishService.save(dishDto);
    }

    @PutMapping("/{dishId}")
    @PreAuthorize("hasRole('ADMIN')")
    public DishDto updateDish(@PathVariable Long dishId, @RequestBody DishDto dishDto) {
        dishDto.setId(dishId);
        return dishService.save(dishDto);
    }

    @DeleteMapping("/{dishId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDish(@PathVariable Long dishId) {
        dishService.deleteById(dishId);
    }
}
