package com.coupled.vault.memories;

import com.coupled.vault.couple.Couple;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "date_images")
public class DateImage {
  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "date_memory_id", nullable = false)
  private DateMemory dateMemory;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "couple_id", nullable = false)
  private Couple couple;

  @Column(nullable = false, length = 200)
  private String originalFilename;

  @Column(nullable = false, length = 200)
  private String storedFilename;

  @Column(nullable = false, length = 300)
  private String storagePath;

  @Column(nullable = false, length = 100)
  private String mimeType;

  @Column(nullable = false)
  private long sizeBytes;

  @Column(nullable = false, length = 300)
  private String url;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public DateMemory getDateMemory() {
    return dateMemory;
  }

  public void setDateMemory(DateMemory dateMemory) {
    this.dateMemory = dateMemory;
  }

  public Couple getCouple() {
    return couple;
  }

  public void setCouple(Couple couple) {
    this.couple = couple;
  }

  public String getOriginalFilename() {
    return originalFilename;
  }

  public void setOriginalFilename(String originalFilename) {
    this.originalFilename = originalFilename;
  }

  public String getStoredFilename() {
    return storedFilename;
  }

  public void setStoredFilename(String storedFilename) {
    this.storedFilename = storedFilename;
  }

  public String getStoragePath() {
    return storagePath;
  }

  public void setStoragePath(String storagePath) {
    this.storagePath = storagePath;
  }

  public String getMimeType() {
    return mimeType;
  }

  public void setMimeType(String mimeType) {
    this.mimeType = mimeType;
  }

  public long getSizeBytes() {
    return sizeBytes;
  }

  public void setSizeBytes(long sizeBytes) {
    this.sizeBytes = sizeBytes;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  @PrePersist
  void ensureId() {
    if (id == null) {
      id = UUID.randomUUID();
    }
  }
}
