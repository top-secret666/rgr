--liquibase formatted sql

--changeset zham:4
ALTER TABLE user_schema.users ADD COLUMN IF NOT EXISTS keycloak_id varchar(255);
ALTER TABLE user_schema.users ADD CONSTRAINT uq_users_keycloak_id UNIQUE (keycloak_id);
