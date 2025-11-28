--liquibase formatted sql

--changeset zham:1
CREATE SCHEMA IF NOT EXISTS order_schema;

--changeset zham:2
CREATE TABLE IF NOT EXISTS order_schema.orders (
    id BIGSERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL,
    order_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    total_price INTEGER NOT NULL
);

--changeset zham:3
CREATE TABLE IF NOT EXISTS order_schema.order_item (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES order_schema.orders(id)
);

--changeset zham:4
CREATE TABLE IF NOT EXISTS order_schema.payment (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    method VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(255) NOT NULL,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES order_schema.orders(id)
);
