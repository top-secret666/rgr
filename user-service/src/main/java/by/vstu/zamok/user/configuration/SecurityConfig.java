package by.vstu.zamok.user.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Разрешаем доступ к Swagger UI и эндпоинту регистрации
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/api/auth/register").permitAll()
                        .anyRequest().authenticated())
                // Включаем стандартную валидацию JWT токенов
                .oauth2ResourceServer(oauth2 -> oauth2.jwt());

        return http.build();
    }
}
