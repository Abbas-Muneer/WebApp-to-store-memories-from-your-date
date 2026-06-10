package com.coupled.vault.couple;

import com.coupled.vault.auth.User;
import com.coupled.vault.common.ApiException;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class CoupleService {
  private final CoupleRepository coupleRepository;

  public CoupleService(CoupleRepository coupleRepository) {
    this.coupleRepository = coupleRepository;
  }

  public Couple createCouple(User partnerA) {
    if (partnerA == null) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Partner required");
    }
    Couple couple = new Couple();
    couple.setPartnerA(partnerA);
    coupleRepository.save(couple);
    return couple;
  }

  public Couple getById(UUID id) {
    return coupleRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Couple not found"));
  }
}
