package by.vstu.zamok.user.controller;

import by.vstu.zamok.user.dto.UserDto;
import by.vstu.zamok.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Ваш существующий endpoint для получения текущего пользователя
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(JwtAuthenticationToken authentication) {
        String email = authentication.getToken().getClaimAsString("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        UserDto userDto = userService.findByEmail(email);
        return ResponseEntity.ok(userDto);
    }

    // Ваш существующий endpoint для обновления пользователя
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateUser(JwtAuthenticationToken authentication, @RequestBody UserDto userDto) {
        String email = authentication.getToken().getClaimAsString("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        UserDto currentUser = userService.findByEmail(email);
        userDto.setId(currentUser.getId());
        UserDto updatedUser = userService.save(userDto);
        return ResponseEntity.ok(updatedUser);
    }

    // Новый endpoint, который мы добавляем для связи сервисов
    @GetMapping("/by-keycloak-id/{keycloakId}")
    public ResponseEntity<UserDto> getUserByKeycloakId(@PathVariable String keycloakId, JwtAuthenticationToken authentication) {
        String subject = authentication.getToken().getSubject();
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!isAdmin && (subject == null || !subject.equals(keycloakId))) {
            throw new AccessDeniedException("You do not have permission to access this user");
        }
        UserDto userDto = userService.findByKeycloakId(keycloakId);
        if (userDto != null) {
            return ResponseEntity.ok(userDto);
        } else {
            // Важно: Возвращаем 404, если пользователь еще не синхронизирован в нашей БД
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchUsers(@RequestParam("query") String query) {
        return ResponseEntity.ok(userService.search(query));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registrationStats(@RequestParam(name = "days", defaultValue = "30") int days) {
        return ResponseEntity.ok(userService.registrationStats(days));
    }
}