package by.vstu.zamok.order.mapper;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.dto.OrderResponseDto;
import by.vstu.zamok.order.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, PaymentMapper.class})
public interface OrderMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "orderDate", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "orderItems", source = "items")
    Order toEntity(OrderRequestDto orderRequestDto);

    @Mapping(source = "payment", target = "payment")
    OrderResponseDto toDto(Order order);
}
