--liquibase formatted sql

--changeset zham:1
CREATE SCHEMA IF NOT EXISTS restaurant_schema;

--changeset zham:2
CREATE TABLE IF NOT EXISTS restaurant_schema.restaurant (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(255),
    address VARCHAR(255)
);

--changeset zham:3
CREATE TABLE IF NOT EXISTS restaurant_schema.dish (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url VARCHAR(255),
    restaurant_id BIGINT NOT NULL,
    CONSTRAINT fk_dish_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant_schema.restaurant(id)
);
