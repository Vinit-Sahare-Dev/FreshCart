package com.example.hotel.controller;

import com.example.hotel.dto.AuthRequest;
import com.example.hotel.dto.AuthResponse;
import com.example.hotel.dto.UserDto;
import com.example.hotel.model.User;
import com.example.hotel.security.JwtUtil;
import com.example.hotel.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, 
                         AuthenticationManager authenticationManager,
                         JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        try {
            // Register the user
            User registeredUser = userService.registerCustomer(user);
            
            // Generate token for the new user
            String token = jwtUtil.generateToken(registeredUser.getEmail());
            
            // Create user DTO
            UserDto userDto = new UserDto(
                registeredUser.getId(), 
                registeredUser.getFullName(), 
                registeredUser.getEmail(), 
                registeredUser.getRole()
            );
            
            // Return token and user info
            return ResponseEntity.ok(new AuthResponse(token, userDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userService.findByEmail(request.getEmail());
            UserDto userDto = new UserDto(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
            String token = jwtUtil.generateToken(request.getEmail());
            return ResponseEntity.ok(new AuthResponse(token, userDto));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new AuthResponse(null, null));
        }
    }
}