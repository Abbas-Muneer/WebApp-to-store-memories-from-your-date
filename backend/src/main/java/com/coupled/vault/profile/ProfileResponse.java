package com.coupled.vault.profile;

import java.util.UUID;

public class ProfileResponse {
  private String userName;
  private String userEmail;
  private String partnerName;
  private String partnerEmail;
  private UUID coupleId;

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getUserEmail() {
    return userEmail;
  }

  public void setUserEmail(String userEmail) {
    this.userEmail = userEmail;
  }

  public String getPartnerName() {
    return partnerName;
  }

  public void setPartnerName(String partnerName) {
    this.partnerName = partnerName;
  }

  public String getPartnerEmail() {
    return partnerEmail;
  }

  public void setPartnerEmail(String partnerEmail) {
    this.partnerEmail = partnerEmail;
  }

  public UUID getCoupleId() {
    return coupleId;
  }

  public void setCoupleId(UUID coupleId) {
    this.coupleId = coupleId;
  }
}
