
-- Вставляем один тестовый заказ
INSERT INTO "order" (id, user_id, restaurant_id, status, special_requests, created_at, updated_at)
VALUES (1, 101, 201, 'PENDING', 'Пожалуйста, без лука', NOW(), NOW());

-- Вставляем две позиции для этого заказа
INSERT INTO order_item (order_id, dish_id, quantity, price)
VALUES (1, 301, 2, 250.75),
       (1, 302, 1, 500.00);

-- Обновляем sequence, чтобы новые заказы начинались с ID 2
ALTER SEQUENCE order_id_seq RESTART WITH 2;
