package com.coupled.vault.memories;

import com.coupled.vault.common.ApiException;
import com.coupled.vault.security.JwtUtil;
import io.jsonwebtoken.Claims;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/images")
public class ImageController {
  private final ImageService imageService;
  private final JwtUtil jwtUtil;

  public ImageController(ImageService imageService, JwtUtil jwtUtil) {
    this.imageService = imageService;
    this.jwtUtil = jwtUtil;
  }

  @GetMapping("/{imageId}")
  public ResponseEntity<Void> getImage(
      @PathVariable UUID imageId,
      @RequestParam(value = "token", required = false) String token
  ) {
    String url;
    if (token != null && !token.isBlank()) {
      Claims claims = jwtUtil.parseClaims(token);
      String coupleIdRaw = claims.get("coupleId", String.class);
      if (coupleIdRaw == null) throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed");
      url = imageService.getImageUrl(imageId, UUID.fromString(coupleIdRaw));
    } else {
      url = imageService.getImageUrl(imageId);
    }
    return ResponseEntity.status(HttpStatus.FOUND).header("Location", url).build();
  }

  @DeleteMapping("/{imageId}")
  public ResponseEntity<Void> deleteImage(@PathVariable UUID imageId) {
    imageService.deleteImage(imageId);
    return ResponseEntity.noContent().build();
  }
}
