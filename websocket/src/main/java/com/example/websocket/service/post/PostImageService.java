package com.example.websocket.service.post;

import com.example.websocket.model.Post;
import com.example.websocket.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class PostImageService {

    private final PostRepository postRepository;
    private final WebClient webClient;

    public PostImageService(PostRepository postRepository) {
        this.postRepository = postRepository;
        this.webClient = WebClient.builder().baseUrl("http://localhost:7000").build();
    }

    public Mono<Post> addImageToPost(String postId, String userId, String imageName,
            String base64Data) {
        return postRepository.findById(postId).flatMap(post -> {
            // Appeler le serveur d'images pour ajouter l'image
            return webClient.post().uri("/server-image/ajouter-image")
                    .bodyValue(new ImageRequest(userId, imageName, base64Data)).retrieve()
                    .bodyToMono(ImageResponse.class).flatMap(response -> {
                        if (response.getLink() != null) {
                            post.addImage(response.getLink());
                            return postRepository.save(post);
                        } else {
                            return Mono.error(new RuntimeException("Failed to upload image"));
                        }
                    });
        });
    }

    private static class ImageRequest {
        private final String userId;
        private final String nom;
        private final String base64;

        public ImageRequest(String userId, String nom, String base64) {
            this.userId = userId;
            this.nom = nom;
            this.base64 = base64;
        }

        // Getters
    }

    private static class ImageResponse {
        private String link;

        public String getLink() {
            return link;
        }

        public void setLink(String link) {
            this.link = link;
        }
    }
}
