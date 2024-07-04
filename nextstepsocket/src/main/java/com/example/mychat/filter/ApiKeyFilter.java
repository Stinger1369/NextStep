package com.example.mychat.filter;

import com.example.mychat.service.ApiKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class ApiKeyFilter implements WebFilter {

    private final ApiKeyService apiKeyService;

    @Autowired
    public ApiKeyFilter(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @Override
    public @NonNull Mono<Void> filter(@NonNull ServerWebExchange exchange, @NonNull WebFilterChain chain) {
        String apiKey = exchange.getRequest().getHeaders().getFirst("API-Key");

        if (apiKey == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return apiKeyService.validateApiKey(apiKey)
                .flatMap(validKey -> chain.filter(exchange))
                .switchIfEmpty(Mono.defer(() -> {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }));
    }
}
