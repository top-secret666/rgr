--liquibase formatted sql

--changeset copilot:us-001-add-keycloak-id
ALTER TABLE user_schema.users
ADD COLUMN IF NOT EXISTS keycloak_id VARCHAR(255) UNIQUE;
