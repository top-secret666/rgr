--liquibase formatted sql

--changeset copilot:rs-audit-001
ALTER TABLE restaurant_schema.restaurant
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();

ALTER TABLE restaurant_schema.dish
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();

--changeset copilot:rs-constraints-002
ALTER TABLE restaurant_schema.dish
    ADD CONSTRAINT IF NOT EXISTS chk_dish_price_non_negative CHECK (price >= 0);

--changeset copilot:rs-indexes-003
CREATE INDEX IF NOT EXISTS idx_dish_restaurant_id ON restaurant_schema.dish(restaurant_id);
