package by.vstu.zamok.order.payment;

import by.vstu.zamok.order.entity.Payment;
import by.vstu.zamok.order.entity.PaymentStatus;
import org.springframework.stereotype.Component;

@Component
public class CardPaymentStrategy implements PaymentStrategy {
    @Override
    public void apply(Payment payment) {
        payment.setStatus(PaymentStatus.COMPLETED.name());
    }
}
