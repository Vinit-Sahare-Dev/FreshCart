package com.example.hotel.controller;

import com.example.hotel.dto.AuthRequest;
import com.example.hotel.dto.AuthResponse;
import com.example.hotel.model.User;
import com.example.hotel.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.frontend.origin}")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody User user) {
        // TODO: hash password and assign default CUSTOMER role in service
        userService.registerCustomer(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        // TODO: Generate JWT based on authenticated principal
        String fakeToken = "FAKE_JWT_TOKEN"; // replace with JwtUtil usage
        return ResponseEntity.ok(new AuthResponse(fakeToken));
    }
}
