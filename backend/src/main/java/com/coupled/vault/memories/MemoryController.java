package com.coupled.vault.memories;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/memories")
public class MemoryController {
  private final MemoryService memoryService;
  private final ImageService imageService;

  public MemoryController(MemoryService memoryService, ImageService imageService) {
    this.memoryService = memoryService;
    this.imageService = imageService;
  }

  @GetMapping("/recent")
  public ResponseEntity<List<MemoryResponse>> recent(@RequestParam(defaultValue = "3") int limit) {
    return ResponseEntity.ok(memoryService.recent(limit));
  }

  @GetMapping
  public ResponseEntity<MemoryPageResponse> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "12") int size,
      @RequestParam(required = false) String search,
      @RequestParam(defaultValue = "recent") String sort
  ) {
    return ResponseEntity.ok(memoryService.list(page, size, search, sort));
  }

  @PostMapping
  public ResponseEntity<MemoryCreateResponse> create(@Valid @RequestBody MemoryCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(memoryService.create(request));
  }

  @PutMapping("/{id}")
  public ResponseEntity<MemoryResponse> update(@PathVariable UUID id, @Valid @RequestBody MemoryUpdateRequest request) {
    return ResponseEntity.ok(memoryService.update(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    memoryService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{id}/images")
  public ResponseEntity<ImageUploadResponse> uploadImages(@PathVariable UUID id, @RequestParam("files") List<MultipartFile> files) {
    return ResponseEntity.ok(imageService.upload(id, files));
  }
}
