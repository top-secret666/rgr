package by.vstu.zamok.restaurant.controller;

import by.vstu.zamok.restaurant.dto.RestaurantDto;
import by.vstu.zamok.restaurant.service.RestaurantService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@AllArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;

    @GetMapping
    public List<RestaurantDto> getAll() {
        return restaurantService.findAll();
    }

    @GetMapping("/{id}")
    public RestaurantDto getById(@PathVariable Long id) {
        return restaurantService.findById(id);
    }

    @PostMapping
    public RestaurantDto create(@RequestBody RestaurantDto restaurant) {
        return restaurantService.save(restaurant);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        restaurantService.deleteById(id);
    }

    @GetMapping("/search")
    public List<RestaurantDto> search(@RequestParam String name) {
        return restaurantService.findByName(name);
    }
}
