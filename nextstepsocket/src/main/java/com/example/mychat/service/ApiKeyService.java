package com.example.mychat.service;

import com.example.mychat.model.ApiKey;
import com.example.mychat.repository.ApiKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;

    @Autowired
    public ApiKeyService(ApiKeyRepository apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }

    public Mono<ApiKey> createApiKey(String key, String owner) {
        ApiKey apiKey = new ApiKey(key, owner);
        return apiKeyRepository.save(apiKey);
    }

    public Mono<ApiKey> validateApiKey(String key) {
        return apiKeyRepository.findByKey(key);
    }

    public Mono<ApiKey> generateApiKey(String owner) {
        String key = UUID.randomUUID().toString();
        ApiKey apiKey = new ApiKey(key, owner);
        return apiKeyRepository.save(apiKey);
    }
}
