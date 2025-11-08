package by.vstu.zamok.order.service;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.entity.Order;
import by.vstu.zamok.order.entity.OrderStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface OrderService {
    // Добавлен userId из токена
    Order placeOrder(OrderRequestDto orderRequestDto, String userId);

    // Добавлен токен для фильтрации заказов по роли/владельцу
    List<Order> getAllOrders(JwtAuthenticationToken authentication);

    // Добавлен токен для проверки владения заказом
    Order getOrderById(Long id, JwtAuthenticationToken authentication);

    Order updateOrderStatus(Long id, OrderStatus status);
}
