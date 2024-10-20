package com.reservoirmap.server.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;

@RestController
public class ReservoirDataController {

    @CrossOrigin(origins = "*")
    @GetMapping("/api/reservoir_percent/{reservoirName}")
    public ResponseEntity<byte[]> getReservoirPercent(@PathVariable String reservoirName) {
        try {
            // 요청받은 저수지명에 해당하는 CSV 파일 경로 설정
            String filePath = "reservoir_percent_data/" + reservoirName + ".csv";
            ClassPathResource csvFile = new ClassPathResource(filePath);

            // 파일 내용을 바이트 배열로 읽기
            InputStream inputStream = csvFile.getInputStream();
            byte[] csvBytes = StreamUtils.copyToByteArray(inputStream);

            // HTTP 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + reservoirName + ".csv");
            headers.add(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8");

            // ResponseEntity로 CSV 파일 반환
            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            // 파일을 찾거나 읽는 도중 오류가 발생한 경우
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/api/reservoir_forecast/{reservoirName}")
    public ResponseEntity<byte[]> getReservoirForecast(@PathVariable String reservoirName) {
        try {
            // 요청받은 저수지명에 해당하는 예측 결과 CSV 파일 경로 설정
            String filePath = "reservoir_forecast_data/" + reservoirName + "_forecast.csv";
            ClassPathResource csvFile = new ClassPathResource(filePath);

            // 파일 내용을 바이트 배열로 읽기
            InputStream inputStream = csvFile.getInputStream();
            byte[] csvBytes = StreamUtils.copyToByteArray(inputStream);

            // HTTP 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + reservoirName + "_forecast.csv");
            headers.add(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8");

            // ResponseEntity로 CSV 파일 반환
            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            // 파일을 찾거나 읽는 도중 오류가 발생한 경우
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
