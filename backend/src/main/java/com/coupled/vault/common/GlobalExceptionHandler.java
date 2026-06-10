package com.coupled.vault.common;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ErrorResponse> handleApi(ApiException ex, HttpServletRequest request) {
    HttpStatus status = ex.getStatus();
    ErrorResponse body = new ErrorResponse(Instant.now(), status.value(), status.getReasonPhrase(), ex.getMessage(), request.getRequestURI());
    return ResponseEntity.status(status).body(body);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
    FieldError fieldError = ex.getBindingResult().getFieldError();
    String message = fieldError != null ? fieldError.getField() + ": " + fieldError.getDefaultMessage() : "Validation error";
    ErrorResponse body = new ErrorResponse(Instant.now(), HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST.getReasonPhrase(), message, request.getRequestURI());
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
    log.error("Unexpected error", ex);
    ErrorResponse body = new ErrorResponse(Instant.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(), HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(), "Unexpected server error", request.getRequestURI());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
