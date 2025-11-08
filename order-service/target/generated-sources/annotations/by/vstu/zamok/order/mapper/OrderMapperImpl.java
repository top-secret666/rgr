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
    date = "2025-11-27T14:09:24+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
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

        order.setRestaurantId( orderRequestDto.getRestaurantId() );
        order.setUserId( orderRequestDto.getUserId() );

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
        if ( order.getOrderDate() != null ) {
            orderResponseDto.setOrderDate( Date.from( order.getOrderDate().toInstant( ZoneOffset.UTC ) ) );
        }
        orderResponseDto.setRestaurantId( order.getRestaurantId() );
        orderResponseDto.setStatus( order.getStatus() );
        if ( order.getTotalPrice() != null ) {
            orderResponseDto.setTotalPrice( BigDecimal.valueOf( order.getTotalPrice() ) );
        }
        orderResponseDto.setUserId( order.getUserId() );

        return orderResponseDto;
    }
}
