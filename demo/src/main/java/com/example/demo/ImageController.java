package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/server-image")
public class ImageController {

    @Value("${image.server.uri}")
    private String imageServerURI;

    private final String UPLOAD_DIR = "src/main/resources/static/images/";

    @PostMapping("/ajouter-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());

        try {
            Path filepath = Paths.get(UPLOAD_DIR + filename);
            Files.createDirectories(filepath.getParent());
            Files.write(filepath, file.getBytes());

            String fileUri = imageServerURI + "/server-image/image/" + filename;
            return ResponseEntity.ok(fileUri);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving image", e);
        }
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filepath = Paths.get(UPLOAD_DIR + filename);
            byte[] image = Files.readAllBytes(filepath);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);

            return new ResponseEntity<>(image, headers, HttpStatus.OK);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found", e);
        }
    }
}
