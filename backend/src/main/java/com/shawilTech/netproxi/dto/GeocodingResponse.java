package com.shawilTech.netproxi.dto;

public class GeocodingResponse {
    private Double lat;
    private Double lng;
    private String displayName;

    public GeocodingResponse() {}

    public GeocodingResponse(Double lat, Double lng, String displayName) {
        this.lat = lat;
        this.lng = lng;
        this.displayName = displayName;
    }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public static GeocodingResponseBuilder builder() {
        return new GeocodingResponseBuilder();
    }

    public static class GeocodingResponseBuilder {
        private Double lat;
        private Double lng;
        private String displayName;

        public GeocodingResponseBuilder lat(Double lat) {
            this.lat = lat;
            return this;
        }

        public GeocodingResponseBuilder lng(Double lng) {
            this.lng = lng;
            return this;
        }

        public GeocodingResponseBuilder displayName(String displayName) {
            this.displayName = displayName;
            return this;
        }

        public GeocodingResponse build() {
            return new GeocodingResponse(lat, lng, displayName);
        }
    }
}