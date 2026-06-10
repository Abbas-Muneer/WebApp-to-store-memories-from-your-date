package com.coupled.vault.auth;

import java.util.UUID;

public class UserResponse {
  private UUID id;
  private String name;
  private String email;
  private UUID coupleId;
  private String partnerName;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public UUID getCoupleId() {
    return coupleId;
  }

  public void setCoupleId(UUID coupleId) {
    this.coupleId = coupleId;
  }

  public String getPartnerName() {
    return partnerName;
  }

  public void setPartnerName(String partnerName) {
    this.partnerName = partnerName;
  }
}
