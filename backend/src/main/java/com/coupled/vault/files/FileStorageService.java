package com.coupled.vault.files;

import com.coupled.vault.common.ApiException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
  private final Path rootPath;
  private final List<String> allowedTypes = List.of(
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif"
  );

  public FileStorageService(@Value("${app.uploads.root}") String rootDir) {
    this.rootPath = Paths.get(rootDir).toAbsolutePath().normalize();
  }

  public StoredFile store(UUID coupleId, UUID memoryId, MultipartFile file) {
    validateFile(file);
    try {
      Path targetDir = rootPath.resolve(coupleId.toString()).resolve(memoryId.toString());
      Files.createDirectories(targetDir);

      String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload";
      String storedFilename = UUID.randomUUID() + "-" + sanitizeFilename(originalFilename);

      Path target = targetDir.resolve(storedFilename);
      Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

      return new StoredFile(originalFilename, storedFilename, file.getContentType(), file.getSize(), target.toString());
    } catch (IOException ex) {
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file");
    }
  }

  public byte[] readFile(String absolutePath) {
    try {
      return Files.readAllBytes(Path.of(absolutePath));
    } catch (IOException ex) {
      throw new ApiException(HttpStatus.NOT_FOUND, "File not found");
    }
  }

  public void deleteFile(String absolutePath) {
    try {
      Files.deleteIfExists(Path.of(absolutePath));
    } catch (IOException ex) {
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file");
    }
  }

  private void validateFile(MultipartFile file) {
    if (file.isEmpty()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "File is empty");
    }
    if (file.getContentType() == null || !allowedTypes.contains(file.getContentType())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid file type");
    }
  }

  private String sanitizeFilename(String name) {
    return name.replaceAll("[^a-zA-Z0-9._-]", "_");
  }

  public record StoredFile(String originalFilename, String storedFilename, String mimeType, long size, String path) {}
}
