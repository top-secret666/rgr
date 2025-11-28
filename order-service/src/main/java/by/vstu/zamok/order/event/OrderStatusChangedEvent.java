package by.vstu.zamok.order.event;

import by.vstu.zamok.order.entity.OrderStatus;

public record OrderStatusChangedEvent(Long orderId, OrderStatus status) {
}
