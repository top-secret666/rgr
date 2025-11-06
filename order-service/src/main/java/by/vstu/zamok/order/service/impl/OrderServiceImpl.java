package by.vstu.zamok.order.service.impl;

import by.vstu.zamok.order.dto.OrderRequestDto;
import by.vstu.zamok.order.entity.Order;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
        order.setUserId(userId);
        order.setStatus(OrderStatus.PENDING); // исправлено
        order.setOrderDate(LocalDateTime.now()); // исправлено

        // Mock dish price calculation
        BigDecimal totalPrice = order.getOrderItems().stream() // исправлено
                .map(item -> new BigDecimal(item.getQuantity()).multiply(new BigDecimal("10.00")))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalPrice(totalPrice.intValue()); // исправлено

        Payment payment = new Payment();
        payment.setMethod(orderRequestDto.getPaymentMethod());
        payment.setAmount(totalPrice.intValue()); // исправлено
        payment.setStatus(PaymentStatus.COMPLETED); // исправлено: Simulate successful payment
        payment.setOrder(order);

        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        kafkaTemplate.send("order-created", new OrderCreatedEvent(savedOrder.getId(), savedOrder.getUserId()));

        return savedOrder;
    }

    @Override
    public List<Order> getAllOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return orderRepository.findAll();
        } else {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            Long userId = jwt.getClaim("userId");
            return orderRepository.findByUserId(userId);
        }
    }

    @Override
    public Order getOrderById(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return order;
        } else {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            Long userId = jwt.getClaim("userId");
            if (order.getUserId().equals(userId)) {
                return order;
            } else {
                throw new ResourceNotFoundException("Order not found with id: " + id);
            }
        }
    }

    @Override
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
