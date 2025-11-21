package com.example.hotel.dto;

public class AuthResponse {
    private String token;

    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token) {
        this.token = token;
    }

    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}