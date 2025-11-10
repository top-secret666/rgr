--liquibase formatted sql

--changeset zham:5
ALTER TABLE order_schema.orders
ALTER COLUMN user_id TYPE VARCHAR(255);