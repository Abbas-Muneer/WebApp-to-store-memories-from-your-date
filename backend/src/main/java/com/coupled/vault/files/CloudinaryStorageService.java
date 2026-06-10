package com.coupled.vault.files;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.coupled.vault.common.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryStorageService {

  private static final Logger log = LoggerFactory.getLogger(CloudinaryStorageService.class);

  private static final List<String> ALLOWED_TYPES = List.of(
      "image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"
  );

  private final Cloudinary cloudinary;

  public CloudinaryStorageService(Cloudinary cloudinary) {
    this.cloudinary = cloudinary;
  }

  public UploadResult upload(UUID coupleId, UUID memoryId, MultipartFile file) {
    if (file.isEmpty()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "File is empty");
    }
    if (file.getContentType() == null || !ALLOWED_TYPES.contains(file.getContentType())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid file type");
    }
    try {
      String publicId = "date-vault/" + coupleId + "/" + memoryId + "/" + UUID.randomUUID();
      @SuppressWarnings("unchecked")
      Map<String, Object> result = (Map<String, Object>) cloudinary.uploader().upload(
          file.getBytes(),
          ObjectUtils.asMap(
              "public_id", publicId,
              "overwrite", false,
              "resource_type", "image"
          )
      );
      String secureUrl = (String) result.get("secure_url");
      String uploadedPublicId = (String) result.get("public_id");
      return new UploadResult(
          file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload",
          uploadedPublicId,
          file.getContentType(),
          file.getSize(),
          secureUrl
      );
    } catch (IOException ex) {
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image");
    }
  }

  public void delete(String publicId) {
    if (publicId == null || publicId.isBlank()) return;
    try {
      cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    } catch (IOException ex) {
      log.warn("Failed to delete Cloudinary asset {}: {}", publicId, ex.getMessage());
    }
  }

  public record UploadResult(
      String originalFilename,
      String publicId,
      String mimeType,
      long size,
      String secureUrl
  ) {}
}
