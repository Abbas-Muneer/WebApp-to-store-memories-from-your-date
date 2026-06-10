package com.coupled.vault.auth;

import com.coupled.vault.common.ApiException;
import com.coupled.vault.couple.Couple;
import com.coupled.vault.couple.CoupleRepository;
import com.coupled.vault.invite.Invite;
import com.coupled.vault.invite.InviteRepository;
import com.coupled.vault.invite.InviteStatus;
import com.coupled.vault.security.JwtUtil;
import com.coupled.vault.security.SecurityUtil;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private static final Logger log = LoggerFactory.getLogger(AuthService.class);
  private final UserRepository userRepository;
  private final InviteRepository inviteRepository;
  private final CoupleRepository coupleRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;

  public AuthService(UserRepository userRepository, InviteRepository inviteRepository, CoupleRepository coupleRepository,
                     PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.inviteRepository = inviteRepository;
    this.coupleRepository = coupleRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
  }

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
      throw new ApiException(HttpStatus.CONFLICT, "Email already exists");
    }

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail().toLowerCase());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

    Invite invite = inviteRepository.findByPartnerEmailIgnoreCaseAndStatus(request.getEmail(), InviteStatus.PENDING)
        .filter(i -> i.getExpiresAt().isAfter(Instant.now()))
        .orElse(null);

    if (invite != null) {
      Couple couple = invite.getCouple();
      if (couple.getPartnerB() != null) {
        throw new ApiException(HttpStatus.CONFLICT, "Couple already has two partners");
      }
      user.setCouple(couple);
      userRepository.save(user);
      couple.setPartnerB(user);
      coupleRepository.save(couple);
      invite.setStatus(InviteStatus.ACCEPTED);
      inviteRepository.save(invite);
    } else {
      userRepository.save(user);
    }

    UUID coupleId = user.getCouple() != null ? user.getCouple().getId() : null;
    String token = jwtUtil.generateToken(user.getId(), user.getEmail(), coupleId);
    log.info("Register success for user {}", user.getEmail());
    return new AuthResponse(token, toUserResponse(user));
  }

  public AuthResponse login(LoginRequest request) {
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
      );
    } catch (Exception ex) {
      log.warn("Login failed for {}", request.getEmail());
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    User user = userRepository.findByEmailIgnoreCase(request.getEmail())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    UUID coupleId = user.getCouple() != null ? user.getCouple().getId() : null;
    String token = jwtUtil.generateToken(user.getId(), user.getEmail(), coupleId);
    log.info("Login success for {}", user.getEmail());
    return new AuthResponse(token, toUserResponse(user));
  }

  public UserResponse me() {
    var principal = SecurityUtil.getCurrentPrincipal()
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
    User user = userRepository.findById(principal.getUserId())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
    return toUserResponse(user);
  }

  private UserResponse toUserResponse(User user) {
    UserResponse response = new UserResponse();
    response.setId(user.getId());
    response.setName(user.getName());
    response.setEmail(user.getEmail());
    response.setCoupleId(user.getCouple() != null ? user.getCouple().getId() : null);
    if (user.getCouple() != null) {
      Couple couple = user.getCouple();
      if (couple.getPartnerA() != null && !couple.getPartnerA().getId().equals(user.getId())) {
        response.setPartnerName(couple.getPartnerA().getName());
      }
      if (couple.getPartnerB() != null && !couple.getPartnerB().getId().equals(user.getId())) {
        response.setPartnerName(couple.getPartnerB().getName());
      }
    }
    return response;
  }
}
