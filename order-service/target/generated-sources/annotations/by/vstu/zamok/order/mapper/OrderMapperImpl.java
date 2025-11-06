package by.vstu.zamok.order.mapper;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.dto.OrderResponseDto;
import by.vstu.zamok.order.entity.Order;
import java.math.BigDecimal;
import java.time.ZoneOffset;
import java.util.Date;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T15:04:25+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    public Order toEntity(OrderRequestDto orderRequestDto) {
        if ( orderRequestDto == null ) {
            return null;
        }

        Order order = new Order();

        order.setUserId( orderRequestDto.getUserId() );
        order.setRestaurantId( orderRequestDto.getRestaurantId() );

        return order;
    }

    @Override
    public OrderResponseDto toDto(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponseDto orderResponseDto = new OrderResponseDto();

        orderResponseDto.setPayment( paymentMapper.toDto( order.getPayment() ) );
        orderResponseDto.setId( order.getId() );
        orderResponseDto.setStatus( order.getStatus() );
        if ( order.getOrderDate() != null ) {
            orderResponseDto.setOrderDate( Date.from( order.getOrderDate().toInstant( ZoneOffset.UTC ) ) );
        }
        orderResponseDto.setUserId( order.getUserId() );
        orderResponseDto.setRestaurantId( order.getRestaurantId() );
        if ( order.getTotalPrice() != null ) {
            orderResponseDto.setTotalPrice( BigDecimal.valueOf( order.getTotalPrice() ) );
        }

        return orderResponseDto;
    }
}
