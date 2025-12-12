package by.vstu.zamok.user.repository;

import by.vstu.zamok.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByKeycloakId(String keycloakId);

    List<User> findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(String emailPart, String namePart);
}
