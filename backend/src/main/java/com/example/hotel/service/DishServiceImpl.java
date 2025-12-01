package com.example.hotel.service;

import com.example.hotel.dto.DishDTO;
import com.example.hotel.model.Dish;
import com.example.hotel.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishServiceImpl implements DishService {

    @Autowired
    private DishRepository dishRepository;

    @Override
    public List<DishDTO> getAllDishes() {
        return dishRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DishDTO getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found"));
        return convertToDTO(dish);
    }

    @Override
    public DishDTO createDish(DishDTO dishDTO) {
        Dish dish = convertToEntity(dishDTO);
        Dish savedDish = dishRepository.save(dish);
        return convertToDTO(savedDish);
    }

    @Override
    public DishDTO updateDish(Long id, DishDTO dishDTO) {
        Dish existingDish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found"));
        
        existingDish.setName(dishDTO.getName());
        existingDish.setDescription(dishDTO.getDescription());
        existingDish.setPrice(dishDTO.getPrice());
        existingDish.setCategory(dishDTO.getCategory());
        existingDish.setImageUrl(dishDTO.getImageUrl());
        existingDish.setAvailable(dishDTO.isAvailable()); // ADDED
        
        Dish updatedDish = dishRepository.save(existingDish);
        return convertToDTO(updatedDish);
    }

    @Override
    public void deleteDish(Long id) {
        dishRepository.deleteById(id);
    }

    @Override
    public List<DishDTO> getDishesByCategory(String category) {
        return dishRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private DishDTO convertToDTO(Dish dish) {
        DishDTO dto = new DishDTO();
        dto.setId(dish.getId());
        dto.setName(dish.getName());
        dto.setDescription(dish.getDescription());
        dto.setPrice(dish.getPrice());
        dto.setCategory(dish.getCategory());
        dto.setImageUrl(normalizeImagePath(dish.getImageUrl()));
        dto.setAvailable(dish.isAvailable()); // ADDED
        return dto;
    }

    private String normalizeImagePath(String rawPath) {
        if (rawPath == null || rawPath.isBlank()) {
            return rawPath;
        }

        String sanitized = rawPath.trim();
        if (sanitized.startsWith("public/")) {
            sanitized = sanitized.substring("public".length());
        }

        if (!sanitized.startsWith("/")) {
            sanitized = "/" + sanitized;
        }

        return sanitized.replace("//", "/");
    }

    private Dish convertToEntity(DishDTO dto) {
        // FIXED: Use dto.isAvailable() instead of hardcoded true
        Dish dish = new Dish(
            dto.getName(), 
            dto.getDescription(), 
            dto.getPrice(), 
            dto.getImageUrl(), 
            dto.getCategory(), 
            dto.isAvailable()  // FIXED
        );
        return dish;
    }
}