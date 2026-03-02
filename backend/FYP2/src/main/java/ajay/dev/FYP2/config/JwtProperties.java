package ajay.dev.FYP2.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {
    private String secret;
    private String algorithm;
    private long accessTokenExpiration;
    private long refreshTokenExpiration;
}
