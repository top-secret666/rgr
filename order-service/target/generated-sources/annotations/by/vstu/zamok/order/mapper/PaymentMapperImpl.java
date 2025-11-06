package by.vstu.zamok.order.mapper;

import by.vstu.zamok.order.dto.PaymentDto;
import by.vstu.zamok.order.entity.Payment;
import by.vstu.zamok.order.entity.PaymentStatus;
import java.math.BigDecimal;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T15:04:25+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class PaymentMapperImpl implements PaymentMapper {

    @Override
    public Payment toEntity(PaymentDto paymentDto) {
        if ( paymentDto == null ) {
            return null;
        }

        Payment payment = new Payment();

        payment.setId( paymentDto.getId() );
        payment.setMethod( paymentDto.getMethod() );
        if ( paymentDto.getAmount() != null ) {
            payment.setAmount( paymentDto.getAmount().intValue() );
        }
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

        paymentDto.setId( payment.getId() );
        paymentDto.setMethod( payment.getMethod() );
        if ( payment.getAmount() != null ) {
            paymentDto.setAmount( BigDecimal.valueOf( payment.getAmount() ) );
        }
        if ( payment.getStatus() != null ) {
            paymentDto.setStatus( Enum.valueOf( PaymentStatus.class, payment.getStatus() ) );
        }

        return paymentDto;
    }
}
