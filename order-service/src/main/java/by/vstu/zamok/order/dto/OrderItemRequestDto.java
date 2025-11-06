package by.vstu.zamok.order.dto;

import lombok.Data;

@Data
public class OrderItemRequestDto {
    private Long dishId;
    private Integer quantity;
}
