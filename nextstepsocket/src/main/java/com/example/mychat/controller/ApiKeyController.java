package com.example.mychat.controller;

import com.example.mychat.service.ApiKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api-keys")
@CrossOrigin(origins = "http://localhost:3000")
public class ApiKeyController {

    private static final Logger logger = LoggerFactory.getLogger(ApiKeyController.class);
    private final ApiKeyService apiKeyService;

    @Autowired
    public ApiKeyController(ApiKeyService apiKeyService) {
        logger.info("ApiKeyController initialized");
        this.apiKeyService = apiKeyService;
    }

    @PostMapping
    public Mono<ServerResponse> createApiKey(@RequestParam String owner) {
        logger.info("Received request to create API key for owner: {}", owner);
        return apiKeyService.generateOrFetchApiKey(owner).flatMap(apiKey -> {
            logger.info("Generated or fetched API key: {}", apiKey.getKey());
            return ServerResponse.ok().bodyValue(apiKey);
        }).doOnError(e -> logger.error("Error generating API key", e));
    }
}
