package com.example.hotel.security;

import org.springframework.stereotype.Component;

/**
 * Utility placeholder for generating and validating JWT tokens.
 * Implement with your preferred JWT library (e.g. io.jsonwebtokenjjwt) as a future step.
 */
@Component
public class JwtUtil {

    public String generateToken(String subject) {
        // TODO: Implement real JWT generation
        return "FAKE_JWT_TOKEN_FOR_" + subject;
    }

    public boolean validateToken(String token) {
        // TODO: Implement real validation
        return token != null && token.startsWith("FAKE_JWT_TOKEN_FOR_");
    }
}
