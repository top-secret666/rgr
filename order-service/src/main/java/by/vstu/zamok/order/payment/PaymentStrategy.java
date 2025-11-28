package by.vstu.zamok.order.payment;

import by.vstu.zamok.order.entity.Payment;

public interface PaymentStrategy {
    void apply(Payment payment);
}
