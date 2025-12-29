package by.vstu.zamok.user.auth;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakProperties {
    /** Base URL without /realms/... e.g. http://localhost:8080 */
    private String baseUrl;

    /** Realm name e.g. master */
    private String realm;

    /** Public client id used for password grant */
    private String clientId;

    /** Keycloak admin credentials for Admin API */
    private String adminUsername;
    private String adminPassword;
}
