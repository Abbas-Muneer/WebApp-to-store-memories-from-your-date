package com.coupled.vault.invite;

import java.time.Instant;

public class InviteValidateResponse {
  private boolean valid;
  private String partnerEmail;
  private Instant expiresAt;

  public boolean isValid() {
    return valid;
  }

  public void setValid(boolean valid) {
    this.valid = valid;
  }

  public String getPartnerEmail() {
    return partnerEmail;
  }

  public void setPartnerEmail(String partnerEmail) {
    this.partnerEmail = partnerEmail;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }
}
