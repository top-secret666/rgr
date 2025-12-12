package by.vstu.zamok.order.dto;

import by.vstu.zamok.order.entity.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class OrderResponseDto {
    private Long id;
    private OrderStatus status;
    private Date orderDate;
    private Long userId;
    private Long restaurantId;
    private BigDecimal totalPrice;
    private List<OrderItemResponseDto> items;
    private PaymentDto payment;
}
