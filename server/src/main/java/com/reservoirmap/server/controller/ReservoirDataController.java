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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
public class ReservoirDataController {

    @CrossOrigin(origins = "*")
    @GetMapping("/api/reservoir_percent/{reservoirName}")
    public ResponseEntity<String> getReservoirPercent(@PathVariable String reservoirName) {
        try {
            // 요청받은 저수지명에 해당하는 CSV 파일 경로 설정
            String fileName = "reservoir_percent_data/" + reservoirName + ".csv";
            ClassPathResource resource = new ClassPathResource(fileName);
            String csvContent = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            // 파일 이름을 UTF-8로 인코딩
            String encodedFileName = URLEncoder.encode(reservoirName + ".csv", StandardCharsets.UTF_8.toString());

            // 파일 내용 클라이언트 전달
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                    .body(csvContent);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading CSV file: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/api/reservoir_forecast/{reservoirName}")
    public ResponseEntity<String> getReservoirForecast(@PathVariable String reservoirName) {
        try {
            // 요청받은 저수지명에 해당하는 CSV 파일 경로 설정
            String fileName = "reservoir_forecast_data/" + reservoirName + "_예측결과.csv";
            ClassPathResource resource = new ClassPathResource(fileName);
            String csvContent = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            // 파일 이름을 UTF-8로 인코딩
            String encodedFileName = URLEncoder.encode(reservoirName + "_예측결과.csv", StandardCharsets.UTF_8.toString());

            // 파일 내용 클라이언트 전달
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                    .body(csvContent);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading CSV file: " + e.getMessage());
        }
    }
}
