package by.vstu.zamok.restaurant.service;

import by.vstu.zamok.restaurant.dto.RatingDto;
import by.vstu.zamok.restaurant.dto.RestaurantDto;
import by.vstu.zamok.restaurant.entity.Restaurant;
import by.vstu.zamok.restaurant.entity.RestaurantRating;
import by.vstu.zamok.restaurant.exception.ResourceNotFoundException;
import by.vstu.zamok.restaurant.mapper.RestaurantMapper;
import by.vstu.zamok.restaurant.repository.RestaurantRatingRepository;
import by.vstu.zamok.restaurant.repository.RestaurantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;
    private final RestaurantRatingRepository ratingRepository;

    public List<RestaurantDto> findAll() {
        return restaurantMapper.toDto(restaurantRepository.findAll());
    }

    public RestaurantDto findById(Long id) {
        Restaurant entity = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found: " + id));
        return restaurantMapper.toDto(entity);
    }

    public RestaurantDto update(Long id, RestaurantDto restaurant) {
        if (!restaurantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Restaurant not found: " + id);
        }
        Restaurant entity = restaurantMapper.toEntity(restaurant);
        entity.setId(id);
        return restaurantMapper.toDto(restaurantRepository.save(entity));
    }

    public RestaurantDto save(RestaurantDto restaurant) {
        Restaurant entity = restaurantMapper.toEntity(restaurant);
        return restaurantMapper.toDto(restaurantRepository.save(entity));
    }

    public void deleteById(Long id) {
        if (!restaurantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Restaurant not found: " + id);
        }
        restaurantRepository.deleteById(id);
    }

    public List<RestaurantDto> findByName(String name) {
        return restaurantMapper.toDto(restaurantRepository.findAllByNameContainingIgnoreCase(name));
    }

    public List<RestaurantDto> findPopular(int limit) {
        var ids = ratingRepository.averageRatings().stream()
                .map(row -> (Long) row[0])
                .limit(Math.max(1, limit))
                .toList();
        return restaurantMapper.toDto(restaurantRepository.findAllById(ids));
    }

    public List<RestaurantDto> findTrending(int days, int limit) {
        LocalDateTime from = LocalDateTime.now().minusDays(Math.max(1, days));
        var ids = ratingRepository.trendingSince(from).stream()
                .map(row -> (Long) row[0])
                .limit(Math.max(1, limit))
                .toList();
        return restaurantMapper.toDto(restaurantRepository.findAllById(ids));
    }

    public void addRating(Long restaurantId, String keycloakId, RatingDto dto) {
        Restaurant r = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found: " + restaurantId));
        RestaurantRating rating = new RestaurantRating();
        rating.setRestaurant(r);
        rating.setKeycloakId(keycloakId == null ? "anonymous" : keycloakId);
        rating.setScore(dto.getScore());
        rating.setComment(dto.getComment());
        rating.setCreatedAt(LocalDateTime.now());
        ratingRepository.save(rating);
    }

    public Map<String, Object> ratingSummary(Long restaurantId) {
        // Ensure restaurant exists
        restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found: " + restaurantId));

        var opt = ratingRepository.ratingSummary(restaurantId);
        if (opt.isEmpty()) {
            return Map.of("restaurantId", restaurantId, "avg", 0.0, "count", 0);
        }

        Object[] row = opt.get();
        Double avg = row[0] == null ? 0.0 : ((Number) row[0]).doubleValue();
        Long count = row[1] == null ? 0L : ((Number) row[1]).longValue();
        return Map.of("restaurantId", restaurantId, "avg", avg, "count", count);
    }
}