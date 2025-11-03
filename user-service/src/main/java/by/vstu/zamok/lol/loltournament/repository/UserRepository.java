package by.vstu.zamok.lol.loltournament.repository;

import by.vstu.zamok.lol.loltournament.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
