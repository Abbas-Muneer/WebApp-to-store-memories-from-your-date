package com.coupled.vault.invite;

import java.time.Instant;

public class InviteCreateResponse {
  private String status;
  private String partnerEmailMasked;
  private Instant expiresAt;
  private String inviteLink;

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getPartnerEmailMasked() {
    return partnerEmailMasked;
  }

  public void setPartnerEmailMasked(String partnerEmailMasked) {
    this.partnerEmailMasked = partnerEmailMasked;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }

  public String getInviteLink() {
    return inviteLink;
  }

  public void setInviteLink(String inviteLink) {
    this.inviteLink = inviteLink;
  }
}
