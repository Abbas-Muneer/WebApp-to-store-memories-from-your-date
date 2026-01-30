package com.coupled.vault.memories;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class MemoryCreateRequest {
  @NotNull
  private LocalDate dateOfDate;

  @NotBlank
  @Size(max = 120)
  private String restaurantName;

  @Min(0)
  @Max(10)
  private int rating;

  @Size(max = 500)
  private String feedback;

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
}
