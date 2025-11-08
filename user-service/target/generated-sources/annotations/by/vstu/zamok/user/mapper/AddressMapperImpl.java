package by.vstu.zamok.user.mapper;

import by.vstu.zamok.user.dto.AddressDto;
import by.vstu.zamok.user.entity.Address;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T14:09:25+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Override
    public AddressDto toDto(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressDto addressDto = new AddressDto();

        addressDto.setCity( address.getCity() );
        addressDto.setCountry( address.getCountry() );
        addressDto.setId( address.getId() );
        addressDto.setState( address.getState() );
        addressDto.setStreet( address.getStreet() );
        addressDto.setZip( address.getZip() );

        return addressDto;
    }

    @Override
    public Address toEntity(AddressDto addressDto) {
        if ( addressDto == null ) {
            return null;
        }

        Address address = new Address();

        address.setCity( addressDto.getCity() );
        address.setCountry( addressDto.getCountry() );
        address.setId( addressDto.getId() );
        address.setState( addressDto.getState() );
        address.setStreet( addressDto.getStreet() );
        address.setZip( addressDto.getZip() );

        return address;
    }
}
