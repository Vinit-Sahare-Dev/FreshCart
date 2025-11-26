package com.example.hotel.service;

import com.example.hotel.model.User;
import com.example.hotel.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void createDefaultAdmin() {
        try {
            if (userRepository.findByEmail("admin@hotel.com").isEmpty()) {
                User adminUser = new User();
                adminUser.setFullName("System Administrator");
                adminUser.setEmail("admin@hotel.com");
                adminUser.setPassword(passwordEncoder.encode("Admin123!"));
                adminUser.setRole("ADMIN");
                adminUser.setEnabled(true);
                
                userRepository.save(adminUser);
                System.out.println("✅ Default admin user created: admin@hotel.com");
            } else {
                System.out.println("ℹ️ Admin user already exists: admin@hotel.com");
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to create admin user: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public User registerCustomer(User user) {
        // Validate input
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        
        // Encode password and set role
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("CUSTOMER");
        user.setEnabled(true);
        
        // Save user
        return userRepository.save(user);
    }

    @Override
    public User registerAdmin(User user) {
        // Validate input
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        
        // Encode password and set role
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ADMIN");
        user.setEnabled(true);
        
        // Save user
        return userRepository.save(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User updateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("User and user ID cannot be null");
        }
        
        // Check if user exists
        User existingUser = userRepository.findById(user.getId())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));
        
        // Update fields (don't update password here unless specifically provided)
        if (user.getFullName() != null) {
            existingUser.setFullName(user.getFullName());
        }
        if (user.getEmail() != null) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getRole() != null) {
            existingUser.setRole(user.getRole());
        }
        
        return userRepository.save(existingUser);
    }
}