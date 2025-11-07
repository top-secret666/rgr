--liquibase formatted sql
--changeset zham:5

-- Вставляем один тестовый заказ. Total price = (2 * 250) + (1 * 500) = 1000
INSERT INTO order_schema.orders (id, user_id, restaurant_id, status, order_date, total_price)
VALUES (1, 101, 201, 'PENDING', NOW(), 1000);

-- Вставляем две позиции для этого заказа
INSERT INTO order_schema.order_item (order_id, dish_id, quantity, price)
VALUES (1, 301, 2, 250),
       (1, 302, 1, 500);

-- Обновляем sequence, чтобы новые заказы начинались с ID 2
ALTER SEQUENCE order_schema.orders_id_seq RESTART WITH 2;
