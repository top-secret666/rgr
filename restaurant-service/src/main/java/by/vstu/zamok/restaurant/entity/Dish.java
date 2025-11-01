package by.vstu.zamok.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dish", schema = "restaurant_schema")
@Data
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private int price;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
}
