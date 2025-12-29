package by.vstu.zamok.user.service.impl;

import by.vstu.zamok.user.dto.UserDto;
import by.vstu.zamok.user.dto.UpdateUserRequest;
import by.vstu.zamok.user.entity.Role;
import by.vstu.zamok.user.entity.User;
import by.vstu.zamok.user.exception.ResourceNotFoundException;
import by.vstu.zamok.user.mapper.UserMapper;
import by.vstu.zamok.user.repository.RoleRepository;
import by.vstu.zamok.user.repository.UserRepository;
import by.vstu.zamok.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    public UserDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDto(user);
    }

    @Override
    public UserDto findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return userMapper.toDto(user);
    }

    @Override
    public UserDto findByKeycloakId(String keycloakId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with keycloakId: " + keycloakId));
        return userMapper.toDto(user);
    }

    @Override
    public UserDto updateById(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user.setUpdatedAt(Timestamp.from(Instant.now()));
        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    @Override
    public UserDto save(UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    public UserDto registerNewUserAccount(UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<UserDto> search(String query) {
        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }
        return userRepository
                .findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(query, query)
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    @Override
    public Map<String, Long> registrationStats(int days) {
        int d = days <= 0 ? 30 : Math.min(days, 180);
        Timestamp from = Timestamp.from(Instant.now().minus(d, ChronoUnit.DAYS));
        // Простая реализация на стороне Java: выбираем всех с createdAt >= from и группируем по дате.
        return userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().after(from))
                .collect(LinkedHashMap::new,
                        (map, u) -> {
                            String day = u.getCreatedAt().toLocalDateTime().toLocalDate().toString();
                            map.put(day, map.getOrDefault(day, 0L) + 1);
                        },
                        LinkedHashMap::putAll);
    }
}
