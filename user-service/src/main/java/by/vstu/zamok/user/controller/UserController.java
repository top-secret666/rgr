package by.vstu.zamok.user.controller;

import by.vstu.zamok.user.dto.UserDto;
import by.vstu.zamok.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UserDto userDto) {
        UserDto currentUser = userService.findByEmail(userDetails.getUsername());
        userDto.setId(currentUser.getId());
        UserDto updatedUser = userService.save(userDto);
        return ResponseEntity.ok(updatedUser);
    }
}
