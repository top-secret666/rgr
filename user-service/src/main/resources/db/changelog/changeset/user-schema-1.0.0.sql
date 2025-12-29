--liquibase formatted sql

--changeset zham:1
CREATE SCHEMA IF NOT EXISTS user_schema;

--changeset zham:2
CREATE TABLE IF NOT EXISTS user_schema.users (
    id bigserial PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    password_hash varchar(255) NOT NULL,
    full_name varchar(255),
    created_at timestamp,
    updated_at timestamp
);

CREATE TABLE IF NOT EXISTS user_schema.roles (
    id bigserial PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_schema.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user_schema.users(id),
    FOREIGN KEY (role_id) REFERENCES user_schema.roles(id)
);

CREATE TABLE IF NOT EXISTS user_schema.address (
    id bigserial PRIMARY KEY,
    street varchar(255),
    city varchar(255),
    zip varchar(255),
    state varchar(255),
    country varchar(255),
    user_id bigint NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_schema.users(id)
);

--changeset zham:3
INSERT INTO user_schema.roles(name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO user_schema.roles(name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;
