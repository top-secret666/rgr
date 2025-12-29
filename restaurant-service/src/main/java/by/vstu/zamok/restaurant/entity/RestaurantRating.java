package by.vstu.zamok.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_rating", schema = "restaurant_schema")
@Data
public class RestaurantRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "keycloak_id", nullable = false)
    private String keycloakId;

    @Column(nullable = false)
    private Integer score;

    @Column
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
