package by.vstu.zamok.order.dto;

import by.vstu.zamok.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "status must not be null")
    private OrderStatus status;
}
