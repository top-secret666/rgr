package by.vstu.zamok.user.auth;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;

@Configuration
@EnableConfigurationProperties(KeycloakProperties.class)
public class KeycloakAdminClientConfig {

    @Bean
    public Keycloak keycloakAdminClient(KeycloakProperties props) {
        return KeycloakBuilder.builder()
                .serverUrl(props.getBaseUrl())
                // Админ в Keycloak создаётся в master realm
                .realm("master")
                .grantType(OAuth2Constants.PASSWORD)
                .clientId("admin-cli")
                .username(props.getAdminUsername())
                .password(props.getAdminPassword())
                .build();
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
