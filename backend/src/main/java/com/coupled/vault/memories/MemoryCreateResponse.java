package com.coupled.vault.memories;

import java.util.UUID;

public class MemoryCreateResponse {
  private UUID id;

  public MemoryCreateResponse() {}

  public MemoryCreateResponse(UUID id) {
    this.id = id;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }
}
