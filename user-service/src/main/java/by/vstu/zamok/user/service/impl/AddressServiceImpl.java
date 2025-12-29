package by.vstu.zamok.user.service.impl;

import by.vstu.zamok.user.dto.AddressDto;
import by.vstu.zamok.user.entity.Address;
import by.vstu.zamok.user.entity.User;
import by.vstu.zamok.user.exception.ResourceNotFoundException;
import by.vstu.zamok.user.mapper.AddressMapper;
import by.vstu.zamok.user.repository.AddressRepository;
import by.vstu.zamok.user.repository.UserRepository;
import by.vstu.zamok.user.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    private User resolveUser(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with keycloakId: " + keycloakId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDto> listMyAddresses(String keycloakId) {
        User user = resolveUser(keycloakId);
        return addressRepository.findByUser_Id(user.getId()).stream().map(addressMapper::toDto).toList();
    }

    @Override
    @Transactional
    public AddressDto addMyAddress(String keycloakId, AddressDto dto) {
        User user = resolveUser(keycloakId);
        Address entity = addressMapper.toEntity(dto);
        entity.setId(null);
        entity.setUser(user);
        return addressMapper.toDto(addressRepository.save(entity));
    }

    @Override
    @Transactional
    public AddressDto updateMyAddress(String keycloakId, Long addressId, AddressDto dto) {
        User user = resolveUser(keycloakId);
        Address entity = addressRepository.findByIdAndUser_Id(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found: " + addressId));

        entity.setStreet(dto.getStreet());
        entity.setCity(dto.getCity());
        entity.setZip(dto.getZip());
        entity.setState(dto.getState());
        entity.setCountry(dto.getCountry());
        return addressMapper.toDto(addressRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteMyAddress(String keycloakId, Long addressId) {
        User user = resolveUser(keycloakId);
        Address entity = addressRepository.findByIdAndUser_Id(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found: " + addressId));
        addressRepository.delete(entity);
    }
}
