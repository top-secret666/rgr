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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    @Override
    @Transactional
    public Order placeOrder(OrderRequestDto orderRequestDto, String userIdString) {
        Order order = orderMapper.toEntity(orderRequestDto);

        order.setStatus(OrderStatus.PENDING);
        // ИСПРАВЛЕНО: Преобразование String в Long перед сохранением
        order.setUserId(Long.parseLong(userIdString));
        order.setOrderDate(LocalDateTime.now());

        int totalPrice = 0;
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
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

        // ВНИМАНИЕ: Это вызовет ошибку, пока не будет исправлен OrderCreatedEvent
        // kafkaTemplate.send("order-created", new OrderCreatedEvent(savedOrder.getId(), savedOrder.getUserId()));

        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders(JwtAuthenticationToken authentication) {
        if (isAdmin(authentication)) {
            return orderRepository.findAll();
        } else {
            // ИСПРАВЛЕНО: Преобразование String в Long для поиска в репозитории
            Long userId = Long.parseLong(authentication.getToken().getSubject());
            return orderRepository.findByUserId(userId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderById(Long id, JwtAuthenticationToken authentication) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        String userIdString = authentication.getToken().getSubject();

        // ИСПРАВЛЕНО: Сравнение Long с Long
        if (isAdmin(authentication) || order.getUserId().equals(Long.parseLong(userIdString))) {
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

    private boolean isAdmin(JwtAuthenticationToken authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }
}
