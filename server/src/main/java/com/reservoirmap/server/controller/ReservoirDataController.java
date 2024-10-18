package com.reservoirmap.server.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class ReservoirDataController {

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/api/reservoir_data")
    public ResponseEntity<String> getReservoirData() {
        try {
            // resources 폴더에 csv 파일 경로
            Path filePath = Paths.get(new ClassPathResource("reservoir_test_data.csv").getURI());

            // 파일 내용을 읽음
            String csvContent = Files.readString(filePath);

            // 파일 내용을 클라이언트에게 전달
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reservoir_test_data.csv\"")
                    .body(csvContent);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading CSV file: " + e.getMessage());
        }
    }
}
