package com.shawilTech.identityservice.service;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;


@Service
public class GeocodingService {


    public double[] getLatLng(String address) {
        try {
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + UriUtils.encode(address, StandardCharsets.UTF_8)
                    + "&format=json&limit=1";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.add("User-Agent", "MyApp/1.0 (aocholayoul8@gmail.com)"); // required by Nominatim

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            List<Map<String, Object>> results = response.getBody();

            if (results == null || results.isEmpty()) return null;

            double lat = Double.parseDouble((String) results.get(0).get("lat"));
            double lon = Double.parseDouble((String) results.get(0).get("lon"));
            return new double[]{lat, lon};

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}