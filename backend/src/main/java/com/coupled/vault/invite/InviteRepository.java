package com.coupled.vault.invite;

import com.coupled.vault.couple.Couple;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InviteRepository extends JpaRepository<Invite, UUID> {
  Optional<Invite> findByToken(String token);
  Optional<Invite> findByPartnerEmailIgnoreCaseAndStatus(String email, InviteStatus status);
  Optional<Invite> findFirstByCoupleAndStatusOrderByCreatedAtDesc(Couple couple, InviteStatus status);
  long countByCoupleAndStatus(Couple couple, InviteStatus status);
  long countByPartnerEmailIgnoreCaseAndStatusAndExpiresAtAfter(String email, InviteStatus status, Instant now);
}
