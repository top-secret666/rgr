package by.vstu.zamok.user.service;

import by.vstu.zamok.user.dto.AddressDto;

import java.util.List;

public interface AddressService {
    List<AddressDto> listMyAddresses(String keycloakId);

    AddressDto addMyAddress(String keycloakId, AddressDto dto);

    AddressDto updateMyAddress(String keycloakId, Long addressId, AddressDto dto);

    void deleteMyAddress(String keycloakId, Long addressId);
}
