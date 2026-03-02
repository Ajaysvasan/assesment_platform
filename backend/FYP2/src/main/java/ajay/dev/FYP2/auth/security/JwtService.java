package ajay.dev.FYP2.auth.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ajay.dev.FYP2.config.JwtProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Autowired
    private JwtProperties jwtProps;

    private Key getSigninKey() {
        return Keys.hmacShaKeyFor(jwtProps.getSecret().getBytes());
    }

    public String generateToken(String email, String role) {
        io.jsonwebtoken.SignatureAlgorithm alg = io.jsonwebtoken.SignatureAlgorithm.forName(jwtProps.getAlgorithm());
        return Jwts.builder().setSubject(email).claim("role", role).setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProps.getAccessTokenExpiration()))
                .signWith(getSigninKey(), alg)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigninKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigninKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
