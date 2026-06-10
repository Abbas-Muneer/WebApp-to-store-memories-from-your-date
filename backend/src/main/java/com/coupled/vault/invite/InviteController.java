package com.coupled.vault.invite;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invites")
public class InviteController {
  private final InviteService inviteService;

  public InviteController(InviteService inviteService) {
    this.inviteService = inviteService;
  }

  @PostMapping
  public ResponseEntity<InviteCreateResponse> create(@Valid @RequestBody InviteRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(inviteService.createInvite(request));
  }

  @GetMapping("/status")
  public ResponseEntity<InviteStatusResponse> status() {
    return ResponseEntity.ok(inviteService.getStatus());
  }

  @GetMapping("/validate")
  public ResponseEntity<InviteValidateResponse> validate(@RequestParam("token") String token) {
    return ResponseEntity.ok(inviteService.validateToken(token));
  }
}
