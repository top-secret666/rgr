![image](https://github.com/user-attachments/assets/29525c34-aba9-4d74-ab47-3d3488780a4c)

## Keycloak + Google SSO + Email Verification

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
