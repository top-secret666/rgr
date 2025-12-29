![image](https://github.com/user-attachments/assets/29525c34-aba9-4d74-ab47-3d3488780a4c)

## Keycloak + Google SSO + Email Verification

## Quickstart (local)

- Start infra (DBs + Keycloak + Kafka):
	- `docker compose --profile all up -d`
- Keycloak UI: `http://localhost:8080` (admin/admin)
- Realm import: on `docker compose --profile all up -d` Keycloak imports `master-realm.json` automatically.
- Databases exposed on host:
	- user-db: `localhost:5432` (db `user_db`, user `user`, pass `password`)
	- restaurant-db: `localhost:5433` (db `restaurant_db`, user `user`, pass `password`)
	- order-db: `localhost:5434` (db `order_db`, user `user`, pass `password`)
- Build all services:
	- `mvn -DskipTests -f pom.xml clean package`
- Run services (3 terminals):
	- `mvn -f user-service/pom.xml spring-boot:run`
	- `mvn -f restaurant-service/pom.xml spring-boot:run`
	- `mvn -f order-service/pom.xml spring-boot:run`

- Prereqs: Keycloak running, a realm (e.g. `master`), SMTP creds, and a Google OAuth client (Client ID/Secret).
- Issuer: Set `KEYCLOAK_ISSUER_URI` for all services to your realm issuer, e.g. `http://localhost:8080/realms/master`.
- Email verification: By default enforced. Disable with `security.require-email-verified=false` per service.

### Keycloak Realm/Client
- Create client: `account-console` or your app client. Access type: public or confidential as needed.
- Client scopes: Ensure `email` scope is included; tokens should carry `email` and `email_verified`.
- Roles: Create realm roles `ROLE_USER`, `ROLE_ADMIN` as needed and map them to users or groups.

### Google Identity Provider (IdP)
- In Google Cloud Console: Create OAuth 2.0 Client (Web), set Authorized redirect URI to `https://<keycloak-host>/realms/<realm>/broker/google/endpoint`.
- In Keycloak: Identity Providers → Add provider → Google → set Client ID/Secret. Enable `Sync Mode: IMPORT`.
- If you use the exported realm config: update `master-realm.json` fields `identityProviders[0].config.clientId/clientSecret` (placeholders are `CHANGE_ME`).
- Mappers: Ensure `email` is mapped; optionally map Google `email_verified` to Keycloak user and token claim.

### SMTP for Verification Emails
- In Keycloak: Realm → Email → configure SMTP (host, port, from, auth). Enable `Verify email` in Realm → Login.
- Test: Send test email; ensure DMARC/SPF allow delivery from your SMTP.

### Service Configs
- user-service: `server.port=8084`. See `user-service/src/main/resources/application.yml` for DB and issuer.
- restaurant-service, order-service: Similar issuer config and `security.require-email-verified` flag.
- Env vars:
	- `KEYCLOAK_ISSUER_URI`: e.g. `http://localhost:8080/realms/master`
	- `REQUIRE_EMAIL_VERIFIED`: `true|false` to override default per service.

### Testing
- Public endpoints:
	- user-service: `POST /api/users/register`, `GET /api/users/by-keycloak-id/{keycloakId}`
	- restaurant-service: public GETs for restaurants/dishes
- Protected endpoints require a JWT from Keycloak; ensure the token contains `email_verified=true` when enforcement is on.

### Notes
- All services run as OAuth2 Resource Servers. If you customize roles, adapt `@PreAuthorize` usages accordingly.
- Liquibase is enabled; Flyway is disabled across services.
