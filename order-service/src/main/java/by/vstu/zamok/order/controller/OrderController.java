package by.vstu.zamok.order.controller;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.dto.OrderResponseDto;
import by.vstu.zamok.order.entity.Order;
import by.vstu.zamok.order.entity.OrderStatus;
import by.vstu.zamok.order.mapper.OrderMapper;
import by.vstu.zamok.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public OrderResponseDto placeOrder(@RequestBody OrderRequestDto orderRequestDto, JwtAuthenticationToken authentication) {
        // Извлекаем ID пользователя (sub) из токена
        String userId = authentication.getToken().getSubject();
        Order order = orderService.placeOrder(orderRequestDto, userId);
        return orderMapper.toDto(order);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<OrderResponseDto> getAllOrders(JwtAuthenticationToken authentication) {
        // Передаем токен в сервис для фильтрации
        return orderService.getAllOrders(authentication).stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public OrderResponseDto getOrderById(@PathVariable Long id, JwtAuthenticationToken authentication) {
        // Передаем токен в сервис для проверки владения
        Order order = orderService.getOrderById(id, authentication);
        return orderMapper.toDto(order);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponseDto updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatus status) {
        Order order = orderService.updateOrderStatus(id, status);
        return orderMapper.toDto(order);
    }
}
