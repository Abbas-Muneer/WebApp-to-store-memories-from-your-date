package com.coupled.vault.memories;

import java.util.List;

public class MemoryPageResponse {
  private List<MemoryResponse> content;
  private int page;
  private int size;
  private long totalElements;
  private int totalPages;

  public List<MemoryResponse> getContent() {
    return content;
  }

  public void setContent(List<MemoryResponse> content) {
    this.content = content;
  }

  public int getPage() {
    return page;
  }

  public void setPage(int page) {
    this.page = page;
  }

  public int getSize() {
    return size;
  }

  public void setSize(int size) {
    this.size = size;
  }

  public long getTotalElements() {
    return totalElements;
  }

  public void setTotalElements(long totalElements) {
    this.totalElements = totalElements;
  }

  public int getTotalPages() {
    return totalPages;
  }

  public void setTotalPages(int totalPages) {
    this.totalPages = totalPages;
  }
}
