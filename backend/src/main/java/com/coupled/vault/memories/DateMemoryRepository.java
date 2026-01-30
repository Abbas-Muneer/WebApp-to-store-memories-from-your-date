package com.coupled.vault.memories;

import com.coupled.vault.couple.Couple;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DateMemoryRepository extends JpaRepository<DateMemory, UUID> {
  Page<DateMemory> findByCoupleAndRestaurantNameContainingIgnoreCase(Couple couple, String restaurantName, Pageable pageable);
  Page<DateMemory> findByCouple(Couple couple, Pageable pageable);
  List<DateMemory> findTop3ByCoupleOrderByDateOfDateDesc(Couple couple);
}
