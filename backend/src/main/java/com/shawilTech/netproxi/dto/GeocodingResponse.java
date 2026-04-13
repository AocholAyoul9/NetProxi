package com.shawilTech.netproxi.dto;

public class GeocodingResponse {
    private double lat;
    private double lng;
    private String displayName;

    public GeocodingResponse() {}

    public GeocodingResponse(double lat, double lng, String displayName) {
        this.lat = lat;
        this.lng = lng;
        this.displayName = displayName;
    }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public static GeocodingResponseBuilder builder() {
        return new GeocodingResponseBuilder();
    }

    public static class GeocodingResponseBuilder {
        private double lat;
        private double lng;
        private String displayName;

        public GeocodingResponseBuilder lat(double lat) {
            this.lat = lat;
            return this;
        }

        public GeocodingResponseBuilder lng(double lng) {
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