package by.vstu.zamok.order.service.impl;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.dto.UserDto;
import by.vstu.zamok.order.entity.Order;
import by.vstu.zamok.order.entity.OrderItem;
import by.vstu.zamok.order.entity.OrderStatus;
import by.vstu.zamok.order.entity.Payment;
import by.vstu.zamok.order.entity.PaymentStatus;
import by.vstu.zamok.order.event.OrderCreatedEvent;
import by.vstu.zamok.order.exception.ResourceNotFoundException;
import by.vstu.zamok.order.mapper.OrderMapper;
import by.vstu.zamok.order.repository.OrderRepository;
import by.vstu.zamok.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate; // Сохранено
    private final RestTemplate restTemplate; // Добавлено

    @Value("${user.service.url}")
    private String USER_SERVICE_URL;

    @Value("${order.kafka.topic:order-created}")
    private String ORDER_CREATED_TOPIC;

    @Override
    @Transactional
    public Order placeOrder(OrderRequestDto orderRequestDto, String keycloakId) {
        System.out.println("--- EXECUTING LATEST CODE ---"); // Сохранено

        Long userId = getUserIdFromKeycloakId(keycloakId);

        Order order = orderMapper.toEntity(orderRequestDto);
        order.setStatus(OrderStatus.PENDING);
        order.setUserId(userId); // Заменено 1L на реальный ID
        order.setOrderDate(LocalDateTime.now());

        int totalPrice = 0;
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
                if (item.getPrice() == null) {
                    item.setPrice(100);
                }
                totalPrice += item.getPrice() * item.getQuantity();
            }
        } else {
            order.setOrderItems(Collections.emptyList());
        }
        order.setTotalPrice(totalPrice);

        Payment payment = new Payment();
        payment.setMethod(orderRequestDto.getPaymentMethod());
        payment.setAmount(totalPrice);
        payment.setStatus(PaymentStatus.PLACED.name());
        payment.setOrder(order);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        // Публикация события в Kafka
        kafkaTemplate.send(ORDER_CREATED_TOPIC, new OrderCreatedEvent(savedOrder.getId(), savedOrder.getUserId()));

        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders(JwtAuthenticationToken authentication) {
        if (isAdmin(authentication)) {
            return orderRepository.findAll();
        } else {
            String keycloakId = authentication.getToken().getSubject();
            Long userId = getUserIdFromKeycloakId(keycloakId);
            return orderRepository.findByUserId(userId); // Заменено 1L
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderById(Long id, JwtAuthenticationToken authentication) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (isAdmin(authentication)) {
            return order;
        }

        String keycloakId = authentication.getToken().getSubject();
        Long userId = getUserIdFromKeycloakId(keycloakId);

        if (Objects.equals(order.getUserId(), userId)) { // Заменено 1L
            return order;
        } else {
            throw new AccessDeniedException("You do not have permission to view this order");
        }
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setStatus(status);
        return orderRepository.save(order);
    }

    private Long getUserIdFromKeycloakId(String keycloakId) {
        String url = USER_SERVICE_URL + "/api/users/by-keycloak-id/" + keycloakId;
        try {
            ResponseEntity<UserDto> response = restTemplate.getForEntity(url, UserDto.class);
            UserDto user = response.getBody();
            if (user == null || user.getId() == null) {
                throw new ResourceNotFoundException("User not found in user-service for keycloakId: " + keycloakId);
            }
            return user.getId();
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("User not found in user-service for keycloakId: " + keycloakId, e);
        }
    }

    private boolean isAdmin(JwtAuthenticationToken authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }
}
