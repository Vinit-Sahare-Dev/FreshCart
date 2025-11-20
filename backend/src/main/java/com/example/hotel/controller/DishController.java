package com.example.hotel.controller;

import com.example.hotel.dto.DishDto;
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
    public ResponseEntity<List<DishDto>> getAllDishes(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(dishService.getDishesByCategory(category));
        }
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    // Admin endpoints (implement auth later)
    @PostMapping
    public ResponseEntity<DishDto> createDish(@RequestBody DishDto dishDto) {
        return ResponseEntity.ok(dishService.createDish(dishDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishDto> updateDish(@PathVariable Long id, @RequestBody DishDto dishDto) {
        return ResponseEntity.ok(dishService.updateDish(id, dishDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.noContent().build();
    }
}
