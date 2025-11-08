package by.vstu.zamok.order.controller;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.dto.OrderResponseDto;
import by.vstu.zamok.order.entity.Order;
import by.vstu.zamok.order.entity.OrderStatus;
import by.vstu.zamok.order.mapper.OrderMapper;
import by.vstu.zamok.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public OrderResponseDto placeOrder(@RequestBody OrderRequestDto orderRequestDto) {
        Order order = orderService.placeOrder(orderRequestDto);
        return orderMapper.toDto(order);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<OrderResponseDto> getAllOrders() {
        return orderService.getAllOrders().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public OrderResponseDto getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return orderMapper.toDto(order);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponseDto updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatus status) {
        Order order = orderService.updateOrderStatus(id, status);
        return orderMapper.toDto(order);
    }
}
