package by.vstu.zamok.order.dto;

import by.vstu.zamok.order.entity.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentDto {
    private Long id;
    private String method;
    private BigDecimal amount;
    private PaymentStatus status;
}
