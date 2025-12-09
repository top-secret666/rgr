-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
                                     id BIGSERIAL PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL UNIQUE
    );

-- Insert basic roles
-- This ensures that these roles are always available in the database
INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_MASTER') ON CONFLICT (name) DO NOTHING;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     keycloak_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
    );

-- Create user_roles join table
CREATE TABLE IF NOT EXISTS user_roles (
                                          user_id BIGINT NOT NULL,
                                          role_id BIGINT NOT NULL,
                                          PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );

-- Create address table
CREATE TABLE IF NOT EXISTS address (
                                       id BIGSERIAL PRIMARY KEY,
                                       user_id BIGINT NOT NULL,
                                       country VARCHAR(255),
    state VARCHAR(255),
    city VARCHAR(255),
    street VARCHAR(255),
    zip VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
