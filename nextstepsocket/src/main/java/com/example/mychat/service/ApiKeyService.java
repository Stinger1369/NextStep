package com.example.mychat.service;

import com.example.mychat.model.ApiKey;
import com.example.mychat.repository.ApiKeyRepository;
import com.example.mychat.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

@Service
public class ApiKeyService {

    private static final Logger logger = LoggerFactory.getLogger(ApiKeyService.class);
    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    @Autowired
    public ApiKeyService(ApiKeyRepository apiKeyRepository, UserRepository userRepository) {
        logger.info("ApiKeyService initialized");
        this.apiKeyRepository = apiKeyRepository;
        this.userRepository = userRepository;
    }

    public Mono<ApiKey> createApiKey(String key, String owner) {
        logger.info("Creating API key for owner: {}", owner);
        ApiKey apiKey = new ApiKey(key, owner);
        return apiKeyRepository.save(apiKey);
    }

    public Mono<ApiKey> validateApiKey(String key) {
        logger.info("Validating API key: {}", key);
        return apiKeyRepository.findByKey(key);
    }

    public Mono<ApiKey> generateOrFetchApiKey(String owner) {
        logger.info("Generating or fetching API key for owner: {}", owner);

        return apiKeyRepository.findByOwner(owner).switchIfEmpty(Mono.defer(() -> {
            String key = UUID.randomUUID().toString();
            ApiKey apiKey = new ApiKey(key, owner);
            return apiKeyRepository.save(apiKey).flatMap(
                    apiKeySaved -> userRepository.findById(new ObjectId(owner)).flatMap(user -> {
                        user.setApiKey(apiKeySaved.getKey());
                        return userRepository.save(user);
                    }).thenReturn(apiKeySaved));
        }));
    }
}
