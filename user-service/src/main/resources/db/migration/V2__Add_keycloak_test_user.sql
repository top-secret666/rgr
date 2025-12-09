-- Insert a test user linked to the specific Keycloak ID from the error
INSERT INTO user_schema.users (email, password_hash, full_name, keycloak_id, created_at, updated_at)
VALUES ('keycloak-user@example.com', 'dummy-password', 'Keycloak Test User', 'f513b6c5-f681-462e-8183-0844eceff8e4', NOW(), NOW())
    ON CONFLICT (keycloak_id) DO NOTHING;

-- Grant the new user the default user role
-- This will only run if the user was just inserted in the statement above
INSERT INTO user_schema.user_roles (user_id, role_id)
SELECT
    (SELECT id FROM user_schema.users WHERE keycloak_id = 'f513b6c5-f681-462e-8183-0844eceff8e4'),
    (SELECT id FROM user_schema.roles WHERE name = 'ROLE_USER')
    ON CONFLICT DO NOTHING;
