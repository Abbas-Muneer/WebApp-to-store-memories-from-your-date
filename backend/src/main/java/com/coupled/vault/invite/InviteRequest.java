package com.coupled.vault.invite;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class InviteRequest {
  @NotBlank
  @Email
  private String partnerEmail;

  public String getPartnerEmail() {
    return partnerEmail;
  }

  public void setPartnerEmail(String partnerEmail) {
    this.partnerEmail = partnerEmail;
  }
}
