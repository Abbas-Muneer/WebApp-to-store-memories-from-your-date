package com.coupled.vault.security;

import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {
  private SecurityUtil() {}

  public static Optional<AuthPrincipal> getCurrentPrincipal() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !(authentication.getPrincipal() instanceof AuthPrincipal)) {
      return Optional.empty();
    }
    return Optional.of((AuthPrincipal) authentication.getPrincipal());
  }
}
