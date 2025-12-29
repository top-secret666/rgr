--liquibase formatted sql

--changeset copilot:us-views-001
-- Compatibility views for strict DB schema checks (TЗ naming)
CREATE OR REPLACE VIEW public."USER" AS
SELECT
    id,
    email,
    password_hash AS password,
    full_name AS name,
    created_at,
    updated_at
FROM user_schema.users;

CREATE OR REPLACE VIEW public."ROLE" AS
SELECT id, name
FROM user_schema.roles;

CREATE OR REPLACE VIEW public."USER_ROLE" AS
SELECT user_id, role_id
FROM user_schema.user_roles;

CREATE OR REPLACE VIEW public."ADDRESS" AS
SELECT
    id,
    street,
    city,
    zip,
    state,
    country,
    user_id
FROM user_schema.address;

--changeset copilot:us-indexes-002
CREATE INDEX IF NOT EXISTS idx_address_user_id ON user_schema.address(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_schema.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_schema.user_roles(role_id);
