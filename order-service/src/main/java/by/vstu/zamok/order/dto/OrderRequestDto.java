package by.vstu.zamok.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDto {
    @NotNull(message = "restaurantId must not be null")
    private Long restaurantId;

    @NotEmpty(message = "items must not be empty")
    @Valid
    private List<OrderItemRequestDto> items;

    @NotBlank(message = "paymentMethod must not be blank")
    private String paymentMethod;
}
