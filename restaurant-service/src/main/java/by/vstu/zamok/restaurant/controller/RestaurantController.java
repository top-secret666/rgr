package by.vstu.zamok.restaurant.controller;

import by.vstu.zamok.restaurant.dto.RestaurantDto;
import by.vstu.zamok.restaurant.dto.RatingDto;
import by.vstu.zamok.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    @PreAuthorize("hasRole('ADMIN')")
    public RestaurantDto create(@RequestBody @Valid RestaurantDto restaurant) {
        return restaurantService.save(restaurant);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        restaurantService.deleteById(id);
    }

    @GetMapping("/search")
    public List<RestaurantDto> search(@RequestParam String name) {
        return restaurantService.findByName(name);
    }

    @GetMapping("/popular")
    public List<RestaurantDto> popular(@RequestParam(defaultValue = "5") int limit) {
        return restaurantService.findPopular(limit);
    }

    @GetMapping("/trending")
    public List<RestaurantDto> trending(@RequestParam(defaultValue = "7") int days,
                                        @RequestParam(defaultValue = "5") int limit) {
        return restaurantService.findTrending(days, limit);
    }

    @PostMapping("/{id}/rating")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public void rate(@PathVariable Long id, @RequestBody @Valid RatingDto dto, JwtAuthenticationToken authentication) {
        String keycloakId = authentication.getToken().getSubject();
        restaurantService.addRating(id, keycloakId, dto);
    }
}
