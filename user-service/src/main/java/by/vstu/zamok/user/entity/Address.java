package by.vstu.zamok.user.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "address") // schema removed
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;
    private String city;
    private String zip;
    private String state;
    private String country;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
