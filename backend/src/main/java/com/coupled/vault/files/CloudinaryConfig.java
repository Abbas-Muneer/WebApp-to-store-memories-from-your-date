package com.coupled.vault.files;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

  @Bean
  public Cloudinary cloudinary(
      @Value("${CLOUDINARY_CLOUD_NAME:local}") String cloudName,
      @Value("${CLOUDINARY_API_KEY:local}") String apiKey,
      @Value("${CLOUDINARY_API_SECRET:local}") String apiSecret
  ) {
    return new Cloudinary(Map.of(
        "cloud_name", cloudName,
        "api_key", apiKey,
        "api_secret", apiSecret,
        "secure", true
    ));
  }
}
