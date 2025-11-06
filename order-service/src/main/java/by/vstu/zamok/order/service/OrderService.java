package by.vstu.zamok.order.service;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.entity.Order;
import by.vstu.zamok.order.entity.OrderStatus;

import java.util.List;

public interface OrderService {
    Order placeOrder(OrderRequestDto orderRequestDto);

    List<Order> getAllOrders();

    Order getOrderById(Long id);

    Order updateOrderStatus(Long id, OrderStatus status);
}
