package by.vstu.zamok.user.repository;

import by.vstu.zamok.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
