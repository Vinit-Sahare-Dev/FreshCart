package com.example.hotel.controller;

import com.example.hotel.dto.AuthRequest;
import com.example.hotel.dto.AuthResponse;
import com.example.hotel.dto.UserDto;
import com.example.hotel.model.User;
import com.example.hotel.security.JwtUtil;
import com.example.hotel.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
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
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            System.out.println("Registration attempt for email: " + user.getEmail());
            
            // Validate input
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Email is required"));
            }
            
            if (user.getPassword() == null || user.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Password must be at least 6 characters"));
            }
            
            if (user.getFullName() == null || user.getFullName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Full name is required"));
            }
            
            // Check if user already exists
            User existingUser = userService.findByEmail(user.getEmail());
            if (existingUser != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse("Email already registered"));
            }
            
            // Register the user
            User registeredUser = userService.registerCustomer(user);
            System.out.println("User registered successfully: " + registeredUser.getEmail());
            
            // Generate token for the new user
            String token = jwtUtil.generateToken(registeredUser.getEmail());
            System.out.println("Token generated for user: " + registeredUser.getEmail());
            
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
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            System.out.println("Login attempt for email: " + request.getEmail());
            
            // Validate input
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Email is required"));
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Password is required"));
            }
            
            // Authenticate user
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        request.getEmail(), 
                        request.getPassword()
                    )
            );
            
            System.out.println("Authentication successful for: " + request.getEmail());

            // Get user details
            User user = userService.findByEmail(request.getEmail());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("User not found"));
            }
            
            // Create user DTO
            UserDto userDto = new UserDto(
                user.getId(), 
                user.getFullName(), 
                user.getEmail(), 
                user.getRole()
            );
            
            // Generate token
            String token = jwtUtil.generateToken(request.getEmail());
            System.out.println("Token generated for user: " + request.getEmail());
            
            return ResponseEntity.ok(new AuthResponse(token, userDto));
            
        } catch (BadCredentialsException e) {
            System.err.println("Invalid credentials for: " + request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("Invalid email or password"));
                
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Login failed: " + e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        error.put("status", "error");
        return error;
    }
}