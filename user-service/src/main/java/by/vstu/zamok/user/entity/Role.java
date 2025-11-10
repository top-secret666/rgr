package by.vstu.zamok.user.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "roles") // schema removed
@Data
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
