package by.vstu.zamok.user.mapper;

import by.vstu.zamok.user.dto.AddressDto;
import by.vstu.zamok.user.entity.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    AddressDto toDto(Address address);

    Address toEntity(AddressDto addressDto);
}
