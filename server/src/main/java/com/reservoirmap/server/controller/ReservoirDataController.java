package com.reservoirmap.server.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class ReservoirDataController {

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/api/reservoir_percent/{reservoirName}")
    public ResponseEntity<String> getReservoirPercent(@PathVariable String reservoirName) {
        try {
            // 요청받은 저수지명에 해당하는 CSV 파일 경로 설정
            String fileName = "reservoir_percent_data/" + reservoirName + ".csv";
            Path filePath = Paths.get(new ClassPathResource(fileName).getURI());

            String csvContent = Files.readString(filePath);

            // 파일 내용 클라이언트 전달
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + reservoirName + ".csv\"")
                    .body(csvContent);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading CSV file: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/api/reservoir_forecast/{reservoirName}")
    public ResponseEntity<String> getReservoirForecast(@PathVariable String reservoirName) {
        try {
            // 요청받은 저수지명에 해당하는 CSV 파일 경로 설정
            String fileName = "reservoir_forecast_data/" + reservoirName + ".csv";
            Path filePath = Paths.get(new ClassPathResource(fileName).getURI());

            String csvContent = Files.readString(filePath);

            // 파일 내용 클라이언트 전달
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + reservoirName + ".csv\"")
                    .body(csvContent);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading CSV file: " + e.getMessage());
        }
    }
}
