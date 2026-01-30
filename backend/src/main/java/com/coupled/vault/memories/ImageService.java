package com.coupled.vault.memories;

import com.coupled.vault.auth.User;
import com.coupled.vault.auth.UserRepository;
import com.coupled.vault.common.ApiException;
import com.coupled.vault.couple.Couple;
import com.coupled.vault.files.FileStorageService;
import com.coupled.vault.security.SecurityUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {
  private static final Logger log = LoggerFactory.getLogger(ImageService.class);
  private final DateMemoryRepository memoryRepository;
  private final DateImageRepository imageRepository;
  private final UserRepository userRepository;
  private final FileStorageService fileStorageService;
  private final int maxFiles;

  public ImageService(DateMemoryRepository memoryRepository, DateImageRepository imageRepository,
                      UserRepository userRepository, FileStorageService fileStorageService,
                      @Value("${app.uploads.max-files}") int maxFiles) {
    this.memoryRepository = memoryRepository;
    this.imageRepository = imageRepository;
    this.userRepository = userRepository;
    this.fileStorageService = fileStorageService;
    this.maxFiles = maxFiles;
  }

  public ImageUploadResponse upload(UUID memoryId, List<MultipartFile> files) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);

    DateMemory memory = memoryRepository.findById(memoryId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Memory not found"));
    if (!memory.getCouple().getId().equals(couple.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed");
    }

    if (files == null || files.isEmpty()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "No files uploaded");
    }

    long existing = imageRepository.countByDateMemoryId(memoryId);
    if (existing + files.size() > maxFiles) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Maximum 5 images per memory");
    }

    List<DateImageResponse> uploaded = new ArrayList<>();
    for (MultipartFile file : files) {
      var stored = fileStorageService.store(couple.getId(), memoryId, file);
      DateImage image = new DateImage();
      if (image.getId() == null) {
        image.setId(UUID.randomUUID());
      }
      image.setDateMemory(memory);
      image.setCouple(couple);
      image.setOriginalFilename(stored.originalFilename());
      image.setStoredFilename(stored.storedFilename());
      image.setStoragePath(stored.path());
      image.setMimeType(stored.mimeType());
      image.setSizeBytes(stored.size());
      image.setUrl("/api/images/" + image.getId());
      imageRepository.save(image);

      DateImageResponse response = new DateImageResponse();
      response.setId(image.getId());
      response.setUrl(image.getUrl());
      uploaded.add(response);
    }

    ImageUploadResponse response = new ImageUploadResponse();
    response.setUploaded(uploaded);

    long totalSize = files.stream().mapToLong(MultipartFile::getSize).sum();
    log.info("Uploaded {} images for memory {} couple {} totalBytes={}", files.size(), memoryId, couple.getId(), totalSize);
    return response;
  }

  public ImagePayload download(UUID imageId) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);

    DateImage image = imageRepository.findById(imageId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Image not found"));
    if (image.getCouple() == null || !image.getCouple().getId().equals(couple.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed");
    }
    byte[] bytes = fileStorageService.readFile(image.getStoragePath());
    return new ImagePayload(bytes, image.getMimeType());
  }

  public ImagePayload downloadWithCoupleId(UUID imageId, UUID coupleId) {
    DateImage image = imageRepository.findById(imageId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Image not found"));
    if (image.getCouple() == null || !image.getCouple().getId().equals(coupleId)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed");
    }
    byte[] bytes = fileStorageService.readFile(image.getStoragePath());
    return new ImagePayload(bytes, image.getMimeType());
  }

  public void deleteImage(UUID imageId) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);

    DateImage image = imageRepository.findById(imageId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Image not found"));
    if (image.getCouple() == null || !image.getCouple().getId().equals(couple.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed");
    }
    fileStorageService.deleteFile(image.getStoragePath());
    imageRepository.delete(image);
    log.info("Deleted image {} couple {}", imageId, couple.getId());
  }

  public void deleteAllForMemory(DateMemory memory, Couple couple) {
    List<DateImage> images = imageRepository.findByDateMemoryId(memory.getId());
    for (DateImage image : images) {
      fileStorageService.deleteFile(image.getStoragePath());
      imageRepository.delete(image);
    }
  }

  private User getCurrentUser() {
    var principal = SecurityUtil.getCurrentPrincipal()
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
    return userRepository.findById(principal.getUserId())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated"));
  }

  private Couple requireCouple(User user) {
    if (user.getCouple() == null) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Invite your partner to create your couple vault first");
    }
    return user.getCouple();
  }

  public record ImagePayload(byte[] bytes, String contentType) {}
}
