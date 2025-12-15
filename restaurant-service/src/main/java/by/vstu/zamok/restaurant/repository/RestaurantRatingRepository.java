package by.vstu.zamok.restaurant.repository;

import by.vstu.zamok.restaurant.entity.RestaurantRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RestaurantRatingRepository extends JpaRepository<RestaurantRating, Long> {
    List<RestaurantRating> findByRestaurant_Id(Long restaurantId);

    @Query("select rr.restaurant.id, avg(rr.score) from RestaurantRating rr group by rr.restaurant.id order by avg(rr.score) desc")
    List<Object[]> averageRatings();

    @Query("select rr.restaurant.id, count(rr.id) from RestaurantRating rr where rr.createdAt >= :from group by rr.restaurant.id order by count(rr.id) desc")
    List<Object[]> trendingSince(@Param("from") LocalDateTime from);

    @Query("select avg(rr.score), count(rr.id) from RestaurantRating rr where rr.restaurant.id = :restaurantId")
    Optional<Object[]> ratingSummary(@Param("restaurantId") Long restaurantId);
}
