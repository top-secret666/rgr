package by.vstu.zamok.order.mapper;

import by.vstu.zamok.order.dto.PaymentDto;
import by.vstu.zamok.order.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    Payment toEntity(PaymentDto paymentDto);
    PaymentDto toDto(Payment payment);
}
