package com.coupled.vault.memories;

import com.coupled.vault.auth.User;
import com.coupled.vault.auth.UserRepository;
import com.coupled.vault.common.ApiException;
import com.coupled.vault.couple.Couple;
import com.coupled.vault.security.SecurityUtil;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class MemoryService {
  private static final Logger log = LoggerFactory.getLogger(MemoryService.class);
  private final DateMemoryRepository memoryRepository;
  private final DateImageRepository imageRepository;
  private final UserRepository userRepository;
  private final ImageService imageService;

  public MemoryService(DateMemoryRepository memoryRepository, DateImageRepository imageRepository,
                       UserRepository userRepository, ImageService imageService) {
    this.memoryRepository = memoryRepository;
    this.imageRepository = imageRepository;
    this.userRepository = userRepository;
    this.imageService = imageService;
  }

  public MemoryCreateResponse create(MemoryCreateRequest request) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);

    DateMemory memory = new DateMemory();
    memory.setCouple(couple);
    memory.setDateOfDate(request.getDateOfDate());
    memory.setRestaurantName(request.getRestaurantName());
    memory.setRating(request.getRating());
    memory.setFeedback(request.getFeedback());
    memory.setCreatedBy(user);
    memory.setCreatedAt(Instant.now());
    memory.setUpdatedAt(Instant.now());

    memoryRepository.save(memory);
    log.info("Memory created id={} coupleId={} userId={}", memory.getId(), couple.getId(), user.getId());
    return new MemoryCreateResponse(memory.getId());
  }

  public MemoryResponse update(UUID id, MemoryUpdateRequest request) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);

    DateMemory memory = memoryRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Memory not found"));
    if (!memory.getCouple().getId().equals(couple.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed");
    }

    memory.setDateOfDate(request.getDateOfDate());
    memory.setRestaurantName(request.getRestaurantName());
    memory.setRating(request.getRating());
    memory.setFeedback(request.getFeedback());
    memory.setUpdatedAt(Instant.now());
    memoryRepository.save(memory);

    log.info("Memory updated id={} coupleId={} userId={}", memory.getId(), couple.getId(), user.getId());
    return toResponse(memory);
  }

  public void delete(UUID id) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);

    DateMemory memory = memoryRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Memory not found"));
    if (!memory.getCouple().getId().equals(couple.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed");
    }

    imageService.deleteAllForMemory(memory, couple);
    memoryRepository.delete(memory);
    log.info("Memory deleted id={} coupleId={} userId={}", memory.getId(), couple.getId(), user.getId());
  }

  public List<MemoryResponse> recent(int limit) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);
    Page<DateMemory> memories = memoryRepository.findByCouple(couple, PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "dateOfDate")));
    return memories.getContent().stream().map(this::toResponse).collect(Collectors.toList());
  }

  public MemoryPageResponse list(int page, int size, String search, String sort) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);

    Sort sortSpec = resolveSort(sort);
    PageRequest pageable = PageRequest.of(page, size, sortSpec);
    Page<DateMemory> result;
    if (search != null && !search.isBlank()) {
      result = memoryRepository.findByCoupleAndRestaurantNameContainingIgnoreCase(couple, search, pageable);
    } else {
      result = memoryRepository.findByCouple(couple, pageable);
    }

    MemoryPageResponse response = new MemoryPageResponse();
    response.setContent(result.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
    response.setPage(result.getNumber());
    response.setSize(result.getSize());
    response.setTotalElements(result.getTotalElements());
    response.setTotalPages(result.getTotalPages());
    return response;
  }

  public DateMemory getMemory(UUID id) {
    User user = getCurrentUser();
    Couple couple = requireCouple(user);
    DateMemory memory = memoryRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Memory not found"));
    if (!memory.getCouple().getId().equals(couple.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed");
    }
    return memory;
  }

  private Sort resolveSort(String sort) {
    if (sort == null) {
      return Sort.by(Sort.Direction.DESC, "dateOfDate");
    }
    return switch (sort) {
      case "oldest" -> Sort.by(Sort.Direction.ASC, "dateOfDate");
      case "highRating" -> Sort.by(Sort.Direction.DESC, "rating");
      case "lowRating" -> Sort.by(Sort.Direction.ASC, "rating");
      default -> Sort.by(Sort.Direction.DESC, "dateOfDate");
    };
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

  private MemoryResponse toResponse(DateMemory memory) {
    MemoryResponse response = new MemoryResponse();
    response.setId(memory.getId());
    response.setDateOfDate(memory.getDateOfDate());
    response.setRestaurantName(memory.getRestaurantName());
    response.setRating(memory.getRating());
    response.setFeedback(memory.getFeedback());
    response.setImages(imageRepository.findByDateMemoryId(memory.getId()).stream()
        .map(this::toImageResponse).collect(Collectors.toList()));
    return response;
  }

  private DateImageResponse toImageResponse(DateImage image) {
    DateImageResponse response = new DateImageResponse();
    response.setId(image.getId());
    response.setUrl(image.getUrl());
    return response;
  }
}
