package by.vstu.zamok.user.service;

import by.vstu.zamok.user.dto.UserDto;
import java.util.List;
import java.util.Map;

public interface UserService {
    UserDto findById(Long id);
    UserDto findByEmail(String email);
    UserDto save(UserDto userDto);
    void deleteById(Long id);
    UserDto registerNewUserAccount(UserDto userDto);
    UserDto findByKeycloakId(String keycloakId); // Добавлено
    List<UserDto> search(String query);
    Map<String, Long> registrationStats(int days);
}
