package com.smartcampus.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/upload")
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        Path path = Paths.get(uploadDir + filename);
        Files.write(path, file.getBytes());

        Map<String, String> result = new HashMap<>();
        result.put("filename", filename);
        result.put("url", "/api/files/" + filename);
        return result;
    }

    @GetMapping("/{filename}")
    public org.springframework.http.ResponseEntity<byte[]> getFile(@PathVariable String filename) throws IOException {
        Path path = Paths.get(uploadDir + filename);
        if (!Files.exists(path)) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        byte[] bytes = Files.readAllBytes(path);
        String contentType = Files.probeContentType(path);
        if (contentType == null) contentType = "application/octet-stream";
        return org.springframework.http.ResponseEntity.ok()
                .header("Content-Type", contentType)
                .body(bytes);
    }
}
