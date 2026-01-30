package com.coupled.vault.memories;

import com.coupled.vault.couple.Couple;
import com.coupled.vault.auth.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "date_memories")
public class DateMemory {
  @Id
  @UuidGenerator
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "couple_id", nullable = false)
  private Couple couple;

  @Column(nullable = false)
  private LocalDate dateOfDate;

  @Column(nullable = false, length = 120)
  private String restaurantName;

  @Column(nullable = false)
  private int rating;

  @Column(length = 500)
  private String feedback;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "created_by_user_id", nullable = false)
  private User createdBy;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  @OneToMany(mappedBy = "dateMemory")
  private List<DateImage> images = new ArrayList<>();

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

  public LocalDate getDateOfDate() {
    return dateOfDate;
  }

  public void setDateOfDate(LocalDate dateOfDate) {
    this.dateOfDate = dateOfDate;
  }

  public String getRestaurantName() {
    return restaurantName;
  }

  public void setRestaurantName(String restaurantName) {
    this.restaurantName = restaurantName;
  }

  public int getRating() {
    return rating;
  }

  public void setRating(int rating) {
    this.rating = rating;
  }

  public String getFeedback() {
    return feedback;
  }

  public void setFeedback(String feedback) {
    this.feedback = feedback;
  }

  public User getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(User createdBy) {
    this.createdBy = createdBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }

  public List<DateImage> getImages() {
    return images;
  }

  public void setImages(List<DateImage> images) {
    this.images = images;
  }
}
