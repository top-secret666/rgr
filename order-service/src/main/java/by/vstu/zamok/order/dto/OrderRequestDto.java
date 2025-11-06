package by.vstu.zamok.order.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDto {
    private Long userId;
    private Long restaurantId;
    private List<OrderItemRequestDto> items;
    private String paymentMethod;
}
