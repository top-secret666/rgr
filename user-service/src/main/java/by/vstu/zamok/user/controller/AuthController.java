package by.vstu.zamok.user.controller;

import by.vstu.zamok.user.dto.UserDto;
import by.vstu.zamok.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users") // ИЗМЕНЕНО: Путь изменен с /api/auth на /api/users
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final UserService userService;


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Validated UserDto userDto) {
        // Проверка на существующего пользователя
        if (userService.findByEmail(userDto.getEmail()) != null) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }
        // Регистрация нового пользователя
        userService.registerNewUserAccount(userDto);

        return ResponseEntity.ok("User registered successfully!");
    }
}
