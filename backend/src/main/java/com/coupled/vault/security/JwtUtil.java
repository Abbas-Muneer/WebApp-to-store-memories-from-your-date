package com.coupled.vault.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
  private final String secret;
  private final long expiryMinutes;

  public JwtUtil(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiry-minutes}") long expiryMinutes) {
    this.secret = secret;
    this.expiryMinutes = expiryMinutes;
  }

  public String generateToken(UUID userId, String email, UUID coupleId) {
    Instant now = Instant.now();
    Instant expiry = now.plusSeconds(expiryMinutes * 60);
    return Jwts.builder()
        .setSubject(userId.toString())
        .claim("email", email)
        .claim("coupleId", coupleId != null ? coupleId.toString() : null)
        .claim("roles", List.of("USER"))
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(expiry))
        .signWith(getKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public Claims parseClaims(String token) {
    return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
  }

  private Key getKey() {
    // Treat secret as raw text by default to avoid Base64 decode failures.
    byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
    return Keys.hmacShaKeyFor(padIfNeeded(bytes));
  }

  private byte[] padIfNeeded(byte[] bytes) {
    if (bytes.length >= 32) {
      return bytes;
    }
    byte[] padded = new byte[32];
    System.arraycopy(bytes, 0, padded, 0, bytes.length);
    return padded;
  }
}
