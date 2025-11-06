package by.vstu.zamok.order.mapper;

import by.vstu.zamok.order.dto.OrderItemRequestDto;
import by.vstu.zamok.order.dto.OrderItemResponseDto;
import by.vstu.zamok.order.entity.OrderItem;
import java.math.BigDecimal;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T15:04:25+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class OrderItemMapperImpl implements OrderItemMapper {

    @Override
    public OrderItem toEntity(OrderItemRequestDto orderItemRequestDto) {
        if ( orderItemRequestDto == null ) {
            return null;
        }

        OrderItem orderItem = new OrderItem();

        orderItem.setDishId( orderItemRequestDto.getDishId() );
        orderItem.setQuantity( orderItemRequestDto.getQuantity() );

        return orderItem;
    }

    @Override
    public OrderItemResponseDto toDto(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        OrderItemResponseDto orderItemResponseDto = new OrderItemResponseDto();

        orderItemResponseDto.setId( orderItem.getId() );
        orderItemResponseDto.setDishId( orderItem.getDishId() );
        orderItemResponseDto.setQuantity( orderItem.getQuantity() );
        if ( orderItem.getPrice() != null ) {
            orderItemResponseDto.setPrice( BigDecimal.valueOf( orderItem.getPrice() ) );
        }

        return orderItemResponseDto;
    }
}
