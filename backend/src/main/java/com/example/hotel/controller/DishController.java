package com.example.hotel.controller;

import com.example.hotel.dto.DishDTO; // Changed from DishDto
import com.example.hotel.service.DishService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "${app.frontend.origin}")
public class DishController {

    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @GetMapping
    public ResponseEntity<List<DishDTO>> getAllDishes(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(dishService.getDishesByCategory(category));
        }
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    @PostMapping
    public ResponseEntity<DishDTO> createDish(@RequestBody DishDTO dishDTO) {
        return ResponseEntity.ok(dishService.createDish(dishDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishDTO> updateDish(@PathVariable Long id, @RequestBody DishDTO dishDTO) {
        return ResponseEntity.ok(dishService.updateDish(id, dishDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.noContent().build();
    }
}