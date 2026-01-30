package com.coupled.vault.security;

import java.util.UUID;

public class AuthPrincipal {
  private final UUID userId;
  private final String email;
  private final UUID coupleId;

  public AuthPrincipal(UUID userId, String email, UUID coupleId) {
    this.userId = userId;
    this.email = email;
    this.coupleId = coupleId;
  }

  public UUID getUserId() {
    return userId;
  }

  public String getEmail() {
    return email;
  }

  public UUID getCoupleId() {
    return coupleId;
  }
}
