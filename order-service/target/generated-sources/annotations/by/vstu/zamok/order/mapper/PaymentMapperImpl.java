package by.vstu.zamok.order.mapper;

import by.vstu.zamok.order.dto.PaymentDto;
import by.vstu.zamok.order.entity.Payment;
import by.vstu.zamok.order.entity.PaymentStatus;
import java.math.BigDecimal;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T14:09:23+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class PaymentMapperImpl implements PaymentMapper {

    @Override
    public Payment toEntity(PaymentDto paymentDto) {
        if ( paymentDto == null ) {
            return null;
        }

        Payment payment = new Payment();

        if ( paymentDto.getAmount() != null ) {
            payment.setAmount( paymentDto.getAmount().intValue() );
        }
        payment.setId( paymentDto.getId() );
        payment.setMethod( paymentDto.getMethod() );
        if ( paymentDto.getStatus() != null ) {
            payment.setStatus( paymentDto.getStatus().name() );
        }

        return payment;
    }

    @Override
    public PaymentDto toDto(Payment payment) {
        if ( payment == null ) {
            return null;
        }

        PaymentDto paymentDto = new PaymentDto();

        if ( payment.getAmount() != null ) {
            paymentDto.setAmount( BigDecimal.valueOf( payment.getAmount() ) );
        }
        paymentDto.setId( payment.getId() );
        paymentDto.setMethod( payment.getMethod() );
        if ( payment.getStatus() != null ) {
            paymentDto.setStatus( Enum.valueOf( PaymentStatus.class, payment.getStatus() ) );
        }

        return paymentDto;
    }
}
