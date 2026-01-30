package com.coupled.vault.profile;

import com.coupled.vault.auth.User;
import com.coupled.vault.auth.UserRepository;
import com.coupled.vault.common.ApiException;
import com.coupled.vault.common.MaskingUtil;
import com.coupled.vault.couple.Couple;
import com.coupled.vault.couple.CoupleRepository;
import com.coupled.vault.invite.InviteRepository;
import com.coupled.vault.invite.InviteStatus;
import com.coupled.vault.security.SecurityUtil;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
  private final UserRepository userRepository;
  private final InviteRepository inviteRepository;
  private final CoupleRepository coupleRepository;

  public ProfileController(UserRepository userRepository, InviteRepository inviteRepository, CoupleRepository coupleRepository) {
    this.userRepository = userRepository;
    this.inviteRepository = inviteRepository;
    this.coupleRepository = coupleRepository;
  }

  @GetMapping
  public ResponseEntity<ProfileResponse> profile() {
    var principal = SecurityUtil.getCurrentPrincipal()
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
    User user = userRepository.findById(principal.getUserId())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));

    ProfileResponse response = new ProfileResponse();
    response.setUserName(user.getName());
    response.setUserEmail(user.getEmail());

    if (user.getCouple() != null) {
      response.setCoupleId(user.getCouple().getId());
      if (user.getCouple().getPartnerA() != null && !user.getCouple().getPartnerA().getId().equals(user.getId())) {
        response.setPartnerName(user.getCouple().getPartnerA().getName());
        response.setPartnerEmail(user.getCouple().getPartnerA().getEmail());
      }
      if (user.getCouple().getPartnerB() != null && !user.getCouple().getPartnerB().getId().equals(user.getId())) {
        response.setPartnerName(user.getCouple().getPartnerB().getName());
        response.setPartnerEmail(user.getCouple().getPartnerB().getEmail());
      }

      inviteRepository.findFirstByCoupleAndStatusOrderByCreatedAtDesc(user.getCouple(), InviteStatus.PENDING)
          .filter(invite -> invite.getExpiresAt().isAfter(Instant.now()))
          .ifPresent(invite -> response.setPartnerEmail(MaskingUtil.maskEmail(invite.getPartnerEmail())));
    }

    return ResponseEntity.ok(response);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteAccount() {
    var principal = SecurityUtil.getCurrentPrincipal()
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
    User user = userRepository.findById(principal.getUserId())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));

    Couple couple = user.getCouple();
    if (couple != null) {
      if (couple.getPartnerA() != null && couple.getPartnerA().getId().equals(user.getId())) {
        if (couple.getPartnerB() != null) {
          couple.setPartnerA(couple.getPartnerB());
          couple.setPartnerB(null);
        } else {
          couple.setPartnerA(null);
        }
      } else if (couple.getPartnerB() != null && couple.getPartnerB().getId().equals(user.getId())) {
        couple.setPartnerB(null);
      }
      user.setCouple(null);
      coupleRepository.save(couple);
    }

    userRepository.delete(user);
    return ResponseEntity.noContent().build();
  }
}
