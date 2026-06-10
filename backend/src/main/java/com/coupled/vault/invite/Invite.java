package com.coupled.vault.invite;

import com.coupled.vault.couple.Couple;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "invites")
public class Invite {
  @Id
  @UuidGenerator
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "couple_id", nullable = false)
  private Couple couple;

  @Column(nullable = false, length = 200)
  private String inviterUserId;

  @Column(nullable = false, length = 200)
  private String partnerEmail;

  @Column(nullable = false, unique = true, length = 200)
  private String token;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private InviteStatus status = InviteStatus.PENDING;

  @Column(nullable = false)
  private Instant expiresAt;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public Couple getCouple() {
    return couple;
  }

  public void setCouple(Couple couple) {
    this.couple = couple;
  }

  public String getInviterUserId() {
    return inviterUserId;
  }

  public void setInviterUserId(String inviterUserId) {
    this.inviterUserId = inviterUserId;
  }

  public String getPartnerEmail() {
    return partnerEmail;
  }

  public void setPartnerEmail(String partnerEmail) {
    this.partnerEmail = partnerEmail;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public InviteStatus getStatus() {
    return status;
  }

  public void setStatus(InviteStatus status) {
    this.status = status;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
