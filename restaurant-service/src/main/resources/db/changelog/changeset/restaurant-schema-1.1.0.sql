--liquibase formatted sql

--changeset copilot:rs-003-rating
CREATE TABLE IF NOT EXISTS restaurant_schema.restaurant_rating (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    keycloak_id VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_rating_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant_schema.restaurant(id)
);

CREATE INDEX IF NOT EXISTS idx_rating_restaurant ON restaurant_schema.restaurant_rating(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_rating_created_at ON restaurant_schema.restaurant_rating(created_at);
