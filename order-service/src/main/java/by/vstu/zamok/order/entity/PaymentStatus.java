package by.vstu.zamok.order.entity;

public enum PaymentStatus {
    PENDING,    // Ожидает оплаты
    COMPLETED,  // Завершен
    FAILED,     // Не удался
    CANCELLED,  // Отменен
    PLACED,
}
