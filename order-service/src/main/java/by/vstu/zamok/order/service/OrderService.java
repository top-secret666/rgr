package by.vstu.zamok.order.service;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.entity.Order;
import by.vstu.zamok.order.entity.OrderStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface OrderService {
    Order placeOrder(OrderRequestDto orderRequestDto, String userId);

    List<Order> getAllOrders(JwtAuthenticationToken authentication);

    Order getOrderById(Long id, JwtAuthenticationToken authentication);

    Order updateOrderStatus(Long id, OrderStatus status);

    Order cancelOrder(Long id, JwtAuthenticationToken authentication);

    Object analyticsSummary(String from, String to);
}
