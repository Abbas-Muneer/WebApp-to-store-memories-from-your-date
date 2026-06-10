package com.coupled.vault.memories;

import java.util.UUID;

public class DateImageResponse {
  private UUID id;
  private String url;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }
}
