package com.example.hotel.controller;

import com.example.hotel.dto.DishDTO;
import com.example.hotel.service.DishService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

    private final DishService dishService;

    public AdminController(DishService dishService) {
        this.dishService = dishService;
    }

    // Get all dishes
    @GetMapping("/dishes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DishDTO>> getAllDishes() {
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    // Get dish by ID
    @GetMapping("/dishes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DishDTO> getDishById(@PathVariable Long id) {
        return ResponseEntity.ok(dishService.getDishById(id));
    }

    // Create new dish
    @PostMapping("/dishes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createDish(@RequestBody DishDTO dishDTO) {
        try {
            DishDTO createdDish = dishService.createDish(dishDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDish);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create dish: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Update dish
    @PutMapping("/dishes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDish(@PathVariable Long id, @RequestBody DishDTO dishDTO) {
        try {
            DishDTO updatedDish = dishService.updateDish(id, dishDTO);
            return ResponseEntity.ok(updatedDish);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update dish: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Delete dish
    @DeleteMapping("/dishes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDish(@PathVariable Long id) {
        try {
            dishService.deleteDish(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Dish deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete dish: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Get dishes by category
    @GetMapping("/dishes/category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DishDTO>> getDishesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(dishService.getDishesByCategory(category));
    }

    // Dashboard statistics
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        List<DishDTO> allDishes = dishService.getAllDishes();
        
        stats.put("totalDishes", allDishes.size());
        stats.put("vegDishes", allDishes.stream().filter(d -> "veg".equals(d.getCategory())).count());
        stats.put("nonVegDishes", allDishes.stream().filter(d -> "nonveg".equals(d.getCategory())).count());
        stats.put("dairyDishes", allDishes.stream().filter(d -> "dairy".equals(d.getCategory())).count());
        stats.put("availableDishes", allDishes.stream().filter(DishDTO::isAvailable).count());
        
        return ResponseEntity.ok(stats);
    }
}