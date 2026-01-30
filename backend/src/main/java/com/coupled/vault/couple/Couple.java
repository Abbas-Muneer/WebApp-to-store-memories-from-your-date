package com.coupled.vault.couple;

import com.coupled.vault.auth.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "couples")
public class Couple {
  @Id
  @UuidGenerator
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "partner_a_user_id", nullable = false)
  private User partnerA;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "partner_b_user_id")
  private User partnerB;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public User getPartnerA() {
    return partnerA;
  }

  public void setPartnerA(User partnerA) {
    this.partnerA = partnerA;
  }

  public User getPartnerB() {
    return partnerB;
  }

  public void setPartnerB(User partnerB) {
    this.partnerB = partnerB;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
