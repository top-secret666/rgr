package by.vstu.zamok.user.mapper;

import by.vstu.zamok.user.dto.AddressDto;
import by.vstu.zamok.user.dto.UserDto;
import by.vstu.zamok.user.entity.Address;
import by.vstu.zamok.user.entity.User;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-10T20:15:22+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Autowired
    private AddressMapper addressMapper;

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setRoles( UserMapper.rolesToString( user.getRoles() ) );
        userDto.setAddresses( addressSetToAddressDtoSet( user.getAddresses() ) );
        userDto.setEmail( user.getEmail() );
        userDto.setFullName( user.getFullName() );
        userDto.setId( user.getId() );

        return userDto;
    }

    @Override
    public User toEntity(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        User user = new User();

        user.setRoles( UserMapper.stringToRoles( userDto.getRoles() ) );
        user.setAddresses( addressDtoSetToAddressSet( userDto.getAddresses() ) );
        user.setEmail( userDto.getEmail() );
        user.setFullName( userDto.getFullName() );
        user.setId( userDto.getId() );

        return user;
    }

    protected Set<AddressDto> addressSetToAddressDtoSet(Set<Address> set) {
        if ( set == null ) {
            return null;
        }

        Set<AddressDto> set1 = new LinkedHashSet<AddressDto>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Address address : set ) {
            set1.add( addressMapper.toDto( address ) );
        }

        return set1;
    }

    protected Set<Address> addressDtoSetToAddressSet(Set<AddressDto> set) {
        if ( set == null ) {
            return null;
        }

        Set<Address> set1 = new LinkedHashSet<Address>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( AddressDto addressDto : set ) {
            set1.add( addressMapper.toEntity( addressDto ) );
        }

        return set1;
    }
}
