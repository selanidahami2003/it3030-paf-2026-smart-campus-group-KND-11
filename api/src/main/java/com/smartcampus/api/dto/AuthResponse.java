package com.smartcampus.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String id;
    private String name;
    private String email;
    private List<String> roles;

    public AuthResponse(String accessToken, String id, String name, String email, List<String> roles) {
        this.accessToken = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }
}
