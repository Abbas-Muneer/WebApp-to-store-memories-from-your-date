package com.coupled.vault.invite;

import java.time.Instant;

public class InviteStatusResponse {
  private boolean hasCouple;
  private boolean partnerLinked;
  private PendingInvite pendingInvite;

  public boolean isHasCouple() {
    return hasCouple;
  }

  public void setHasCouple(boolean hasCouple) {
    this.hasCouple = hasCouple;
  }

  public boolean isPartnerLinked() {
    return partnerLinked;
  }

  public void setPartnerLinked(boolean partnerLinked) {
    this.partnerLinked = partnerLinked;
  }

  public PendingInvite getPendingInvite() {
    return pendingInvite;
  }

  public void setPendingInvite(PendingInvite pendingInvite) {
    this.pendingInvite = pendingInvite;
  }

  public static class PendingInvite {
    private String partnerEmailMasked;
    private Instant expiresAt;

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
  }
}
