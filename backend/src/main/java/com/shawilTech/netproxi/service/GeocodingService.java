package com.shawilTech.netproxi.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import jakarta.annotation.PostConstruct;


@Service
public class GeocodingService {

    private final RestTemplate restTemplate;
    private final Map<String, com.shawilTech.netproxi.dto.GeocodingResponse> cache = new ConcurrentHashMap<>();
    private long lastRequestTime = 0;
    private static final long MIN_REQUEST_INTERVAL_MS = 1500; // 1.5 seconds between requests

    public GeocodingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

    public com.shawilTech.netproxi.dto.GeocodingResponse geocodeAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return com.shawilTech.netproxi.dto.GeocodingResponse.builder().build();
        }

        String cacheKey = address.trim().toLowerCase();
        
        if (cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        try {
            synchronized (this) {
                long now = System.currentTimeMillis();
                long timeSinceLastRequest = now - lastRequestTime;
                if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
                    Thread.sleep(MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest);
                }
                lastRequestTime = System.currentTimeMillis();
            }

            String url = NOMINATIM_URL + "?q="
                    + UriUtils.encode(address, StandardCharsets.UTF_8)
                    + "&format=json&limit=1";

            HttpHeaders headers = new HttpHeaders();
            headers.add("User-Agent", "NetProxi/1.0 (contact@netproxi.com)");
            headers.add("Accept-Language", "en-US,en;q=0.9");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            List<Map<String, Object>> results = response.getBody();

            if (results == null || results.isEmpty()) {
                com.shawilTech.netproxi.dto.GeocodingResponse emptyResponse = 
                    com.shawilTech.netproxi.dto.GeocodingResponse.builder().build();
                cache.put(cacheKey, emptyResponse);
                return emptyResponse;
            }

            double lat = Double.parseDouble((String) results.get(0).get("lat"));
            double lon = Double.parseDouble((String) results.get(0).get("lon"));
            String displayName = (String) results.get(0).get("display_name");

            com.shawilTech.netproxi.dto.GeocodingResponse responseDto = 
                com.shawilTech.netproxi.dto.GeocodingResponse.builder()
                    .lat(lat)
                    .lng(lon)
                    .displayName(displayName)
                    .build();

            cache.put(cacheKey, responseDto);
            return responseDto;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return com.shawilTech.netproxi.dto.GeocodingResponse.builder().build();
        } catch (Exception e) {
            e.printStackTrace();
            return com.shawilTech.netproxi.dto.GeocodingResponse.builder().build();
        }
    }
}