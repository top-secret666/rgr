package by.vstu.zamok.user.repository;

import by.vstu.zamok.user.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
	List<Address> findByUser_Id(Long userId);

	Optional<Address> findByIdAndUser_Id(Long id, Long userId);
}
