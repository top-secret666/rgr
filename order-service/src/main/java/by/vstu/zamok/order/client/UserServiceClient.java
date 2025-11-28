package by.vstu.zamok.order.client;

import by.vstu.zamok.order.dto.UserDto;
import by.vstu.zamok.order.exception.ResourceNotFoundException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestTemplate restTemplate;

    @Value("${user.service.url}")
    private String userServiceUrl;

    @Retry(name = "userService", fallbackMethod = "userFallback")
    @CircuitBreaker(name = "userService", fallbackMethod = "userFallback")
    public Long resolveUserId(JwtAuthenticationToken authentication) {
        String keycloakId = authentication.getToken().getSubject();
        String bearer = authentication.getToken().getTokenValue();

        String url = userServiceUrl + "/api/users/by-keycloak-id/" + keycloakId;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(bearer);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<UserDto> response = restTemplate.exchange(url, HttpMethod.GET, entity, UserDto.class);
            UserDto user = response.getBody();
            if (user == null || user.getId() == null) {
                throw new ResourceNotFoundException("User not found in user-service for keycloakId: " + keycloakId);
            }
            return user.getId();
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("User not found in user-service for keycloakId: " + keycloakId, e);
        }
    }

    @SuppressWarnings("unused")
    private Long userFallback(JwtAuthenticationToken authentication, Throwable t) {
        String keycloakId = authentication.getToken().getSubject();
        throw new ResourceNotFoundException("User-service unavailable or user not found for keycloakId: " + keycloakId, t);
    }
}
