package com.coupled.vault.memories;

import com.coupled.vault.couple.Couple;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DateImageRepository extends JpaRepository<DateImage, UUID> {
  List<DateImage> findByDateMemoryId(UUID dateMemoryId);
  Optional<DateImage> findByIdAndCouple(UUID id, Couple couple);
  long countByDateMemoryId(UUID dateMemoryId);
}
