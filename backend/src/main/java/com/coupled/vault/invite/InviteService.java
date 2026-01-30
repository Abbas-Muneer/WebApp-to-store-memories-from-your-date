package com.coupled.vault.invite;

import com.coupled.vault.auth.User;
import com.coupled.vault.auth.UserRepository;
import com.coupled.vault.common.ApiException;
import com.coupled.vault.common.MaskingUtil;
import com.coupled.vault.couple.Couple;
import com.coupled.vault.couple.CoupleService;
import com.coupled.vault.security.SecurityUtil;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class InviteService {
  private static final Logger log = LoggerFactory.getLogger(InviteService.class);
  private final InviteRepository inviteRepository;
  private final UserRepository userRepository;
  private final CoupleService coupleService;
  private final JavaMailSender mailSender;
  private final Environment environment;
  private final String inviteBaseUrl;
  private final long expiryDays;

  public InviteService(InviteRepository inviteRepository, UserRepository userRepository, CoupleService coupleService,
                       JavaMailSender mailSender, Environment environment,
                       @Value("${app.frontend.invite-url}") String inviteBaseUrl,
                       @Value("${app.invites.expiry-days}") long expiryDays) {
    this.inviteRepository = inviteRepository;
    this.userRepository = userRepository;
    this.coupleService = coupleService;
    this.mailSender = mailSender;
    this.environment = environment;
    this.inviteBaseUrl = inviteBaseUrl;
    this.expiryDays = expiryDays;
  }

  public InviteCreateResponse createInvite(InviteRequest request) {
    var principal = SecurityUtil.getCurrentPrincipal()
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
    User user = userRepository.findById(principal.getUserId())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));

    if (request.getPartnerEmail().equalsIgnoreCase(user.getEmail())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot invite yourself");
    }

    Couple couple = user.getCouple();
    if (couple == null) {
      couple = coupleService.createCouple(user);
      user.setCouple(couple);
      userRepository.save(user);
    }

    if (couple.getPartnerB() != null) {
      throw new ApiException(HttpStatus.CONFLICT, "Partner already linked");
    }

    inviteRepository.findFirstByCoupleAndStatusOrderByCreatedAtDesc(couple, InviteStatus.PENDING)
        .ifPresent(existing -> {
          if (existing.getExpiresAt().isBefore(Instant.now())) {
            existing.setStatus(InviteStatus.EXPIRED);
            inviteRepository.save(existing);
          } else {
            throw new ApiException(HttpStatus.CONFLICT, "A pending invite already exists");
          }
        });

    Invite invite = new Invite();
    invite.setCouple(couple);
    invite.setInviterUserId(user.getId().toString());
    invite.setPartnerEmail(request.getPartnerEmail().toLowerCase());
    invite.setToken(UUID.randomUUID() + "-" + UUID.randomUUID());
    invite.setExpiresAt(Instant.now().plus(expiryDays, ChronoUnit.DAYS));
    inviteRepository.save(invite);

    String inviteLink = inviteBaseUrl + invite.getToken();
    sendInviteEmail(request.getPartnerEmail(), inviteLink);

    InviteCreateResponse response = new InviteCreateResponse();
    response.setStatus(invite.getStatus().name());
    response.setPartnerEmailMasked(MaskingUtil.maskEmail(invite.getPartnerEmail()));
    response.setExpiresAt(invite.getExpiresAt());

    log.info("Invite created for {} by user {}", MaskingUtil.maskEmail(invite.getPartnerEmail()), user.getEmail());
    return response;
  }

  public InviteStatusResponse getStatus() {
    var principal = SecurityUtil.getCurrentPrincipal()
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
    User user = userRepository.findById(principal.getUserId())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));

    InviteStatusResponse response = new InviteStatusResponse();
    if (user.getCouple() == null) {
      response.setHasCouple(false);
      response.setPartnerLinked(false);
      return response;
    }

    response.setHasCouple(true);
    response.setPartnerLinked(user.getCouple().getPartnerB() != null);

    inviteRepository.findFirstByCoupleAndStatusOrderByCreatedAtDesc(user.getCouple(), InviteStatus.PENDING)
        .filter(invite -> invite.getExpiresAt().isAfter(Instant.now()))
        .ifPresent(invite -> {
          InviteStatusResponse.PendingInvite pending = new InviteStatusResponse.PendingInvite();
          pending.setPartnerEmailMasked(MaskingUtil.maskEmail(invite.getPartnerEmail()));
          pending.setExpiresAt(invite.getExpiresAt());
          response.setPendingInvite(pending);
        });

    return response;
  }

  public InviteValidateResponse validateToken(String token) {
    Invite invite = inviteRepository.findByToken(token)
        .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid invite"));

    if (invite.getStatus() != InviteStatus.PENDING || invite.getExpiresAt().isBefore(Instant.now())) {
      invite.setStatus(InviteStatus.EXPIRED);
      inviteRepository.save(invite);
      throw new ApiException(HttpStatus.BAD_REQUEST, "Invite expired or invalid");
    }

    InviteValidateResponse response = new InviteValidateResponse();
    response.setValid(true);
    response.setPartnerEmail(invite.getPartnerEmail());
    response.setExpiresAt(invite.getExpiresAt());
    return response;
  }

  private void sendInviteEmail(String partnerEmail, String inviteLink) {
    String host = environment.getProperty("spring.mail.host");
    if (host == null || host.isBlank()) {
      log.info("SMTP not configured. Invite link: {}", inviteLink);
      return;
    }

    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(partnerEmail);
      message.setSubject("You're invited to CoupleDateVault");
      message.setText("You've been invited to join CoupleDateVault. Click the link to accept: " + inviteLink);
      mailSender.send(message);
      log.info("Invite email sent to {}", MaskingUtil.maskEmail(partnerEmail));
    } catch (Exception ex) {
      log.warn("Failed to send invite email. Invite link: {}. Error: {}", inviteLink, ex.getMessage());
    }
  }
}
