package by.vstu.zamok.order.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponseDto {
    private Long id;
    private Long dishId;
    private Integer quantity;
    private BigDecimal price;
}
