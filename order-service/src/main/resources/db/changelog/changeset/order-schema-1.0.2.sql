--liquibase formatted sql

--changeset zham:6
-- Spec compliance: keep user_id as BIGINT (references user-service numeric id)
ALTER TABLE order_schema.orders
ALTER COLUMN user_id TYPE BIGINT USING user_id::bigint;
