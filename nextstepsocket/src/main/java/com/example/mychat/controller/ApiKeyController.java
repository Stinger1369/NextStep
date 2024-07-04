package com.example.mychat.controller;

import com.example.mychat.service.ApiKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.server.ServerResponse;

@RestController
@RequestMapping("/api-keys")
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @Autowired
    public ApiKeyController(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @PostMapping
    public Mono<ServerResponse> createApiKey(@RequestParam String owner) {
        return apiKeyService.generateApiKey(owner)
                .flatMap(apiKey -> ServerResponse.ok().bodyValue(apiKey));
    }
}
