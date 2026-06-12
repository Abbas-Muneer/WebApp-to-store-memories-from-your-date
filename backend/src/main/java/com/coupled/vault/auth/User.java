package com.coupled.vault.auth;

import com.coupled.vault.couple.Couple;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "users")
public class User {
  @Id
  @UuidGenerator
  private UUID id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, unique = true, length = 200)
  private String email;

  @Column(nullable = false, length = 200)
  private String passwordHash;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "couple_id")
  private Couple couple;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

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

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public Couple getCouple() {
    return couple;
  }

  public void setCouple(Couple couple) {
    this.couple = couple;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
