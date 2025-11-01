package by.vstu.zamok.user.mapper;

import by.vstu.zamok.user.dto.UserDto;
import by.vstu.zamok.user.entity.User;
import by.vstu.zamok.user.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", source = "roles", qualifiedByName = "rolesToString")
    UserDto toDto(User user);

    User toEntity(UserDto userDto);

    @Named("rolesToString")
    static Set<String> rolesToString(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream().map(Role::getName).collect(Collectors.toSet());
    }
}
