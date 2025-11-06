package by.vstu.zamok.order.service.impl;

import by.vstu.zamok.order.dto.OrderRequestDto;
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
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    @Override
    @Transactional
    public Order placeOrder(OrderRequestDto orderRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("userId");

        Order order = orderMapper.toEntity(orderRequestDto);

        order.setStatus(OrderStatus.PENDING);
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setRestaurantId(orderRequestDto.getRestaurantId());

        int totalPrice = 0;
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
            }
            totalPrice = order.getOrderItems().stream()
                    .mapToInt(item -> item.getPrice() * item.getQuantity())
                    .sum();
        } else {
            order.setOrderItems(Collections.emptyList());
        }
        order.setTotalPrice(totalPrice);

        Payment payment = new Payment();
        payment.setMethod(orderRequestDto.getPaymentMethod());
        payment.setAmount(totalPrice);
        // ИСПРАВЛЕНО: Enum 'PaymentStatus' преобразован в String с помощью .name()
        payment.setStatus(PaymentStatus.PLACED.name());
        payment.setOrder(order);

        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        kafkaTemplate.send("order-created", new OrderCreatedEvent(savedOrder.getId(), savedOrder.getUserId()));

        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (isAdmin(authentication)) {
            return orderRepository.findAll();
        } else {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            Long userId = jwt.getClaim("userId");
            return orderRepository.findByUserId(userId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("userId");

        if (isAdmin(authentication) || order.getUserId().equals(userId)) {
            return order;
        } else {
            throw new AccessDeniedException("You do not have permission to view this order");
        }
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!isAdmin(authentication)) {
            throw new AccessDeniedException("Only administrators can change the order status");
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setStatus(status);
        return orderRepository.save(order);
    }

    /**
     * Вспомогательный метод для безопасной проверки роли администратора.
     */
    private boolean isAdmin(Authentication authentication) {
        return Optional.ofNullable(authentication)
                .map(Authentication::getAuthorities)
                .orElse(Collections.emptyList())
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
