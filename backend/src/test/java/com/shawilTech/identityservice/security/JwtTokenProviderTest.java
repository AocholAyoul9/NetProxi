package com.shawilTech.identityservice.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.shawilTech.netproxi.security.JwtTokenProvider;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Base64;

import javax.crypto.SecretKey;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        String base64Secret = Base64.getEncoder().encodeToString(key.getEncoded());

        jwtTokenProvider = new JwtTokenProvider(
                base64Secret,
                3600000L,
                604800000L);
    }

    @Test
    void generateToken_returnsNonNullToken() {
        String token = jwtTokenProvider.generateToken("testuser");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void validateToken_withValidToken_returnsTrue() {
        String token = jwtTokenProvider.generateToken("testuser");
        assertTrue(jwtTokenProvider.validateToken(token));
    }

    @Test
    void validateToken_withInvalidToken_returnsFalse() {
        assertFalse(jwtTokenProvider.validateToken("invalid.jwt.token"));
    }

    @Test
    void validateToken_withEmptyString_returnsFalse() {
        assertFalse(jwtTokenProvider.validateToken(""));
    }

    @Test
    void getUsernameFromToken_returnsCorrectUsername() {
        String username = "testuser";
        String token = jwtTokenProvider.generateToken(username);
        assertEquals(username, jwtTokenProvider.getUsernameFromToken(token));
    }

    @Test
    void generateToken_differentUsersProduceDifferentTokens() {
        String token1 = jwtTokenProvider.generateToken("user1");
        String token2 = jwtTokenProvider.generateToken("user2");
        assertNotEquals(token1, token2);
    }
}