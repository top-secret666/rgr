package by.vstu.zamok.order.payment;

import org.springframework.stereotype.Component;

@Component
public class PaymentStrategyFactory {
    private final CardPaymentStrategy card;
    private final CashPaymentStrategy cash;

    public PaymentStrategyFactory(CardPaymentStrategy card, CashPaymentStrategy cash) {
        this.card = card;
        this.cash = cash;
    }

    public PaymentStrategy forMethod(String method) {
        String normalized = method == null ? "CASH" : method.trim().toUpperCase();
        if ("CARD".equals(normalized)) {
            return card;
        }
        return cash;
    }
}
