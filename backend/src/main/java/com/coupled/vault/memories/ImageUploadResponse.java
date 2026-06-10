package com.coupled.vault.memories;

import java.util.List;

public class ImageUploadResponse {
  private List<DateImageResponse> uploaded;

  public List<DateImageResponse> getUploaded() {
    return uploaded;
  }

  public void setUploaded(List<DateImageResponse> uploaded) {
    this.uploaded = uploaded;
  }
}
