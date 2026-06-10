package com.coupled.vault.memories;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class MemoryResponse {
  private UUID id;
  private LocalDate dateOfDate;
  private String restaurantName;
  private int rating;
  private String feedback;
  private List<DateImageResponse> images = new ArrayList<>();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
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

  public List<DateImageResponse> getImages() {
    return images;
  }

  public void setImages(List<DateImageResponse> images) {
    this.images = images;
  }
}
