package by.vstu.zamok.order.mapper;

import by.vstu.zamok.order.dto.OrderItemRequestDto;
import by.vstu.zamok.order.dto.OrderItemResponseDto;
import by.vstu.zamok.order.entity.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItem toEntity(OrderItemRequestDto orderItemRequestDto);
    OrderItemResponseDto toDto(OrderItem orderItem);
}
