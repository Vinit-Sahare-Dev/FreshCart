package com.example.hotel.service;

import com.example.hotel.dto.DishDto;
import com.example.hotel.model.Dish;
import com.example.hotel.repository.DishRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DishServiceImpl implements DishService {

    private final DishRepository dishRepository;

    public DishServiceImpl(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    @Override
    public List<DishDto> getAllDishes() {
        return dishRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DishDto> getDishesByCategory(String category) {
        return dishRepository.findByCategoryAndAvailableTrue(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DishDto createDish(DishDto dishDto) {
        Dish dish = convertToEntity(dishDto);
        Dish saved = dishRepository.save(dish);
        return convertToDto(saved);
    }

    @Override
    public DishDto updateDish(Long id, DishDto dishDto) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found with id: " + id));
        
        dish.setName(dishDto.getName());
        dish.setDescription(dishDto.getDescription());
        dish.setPrice(dishDto.getPrice());
        dish.setImageUrl(dishDto.getImageUrl());
        dish.setCategory(dishDto.getCategory());
        dish.setAvailable(dishDto.isAvailable());
        
        Dish updated = dishRepository.save(dish);
        return convertToDto(updated);
    }

    @Override
    public void deleteDish(Long id) {
        dishRepository.deleteById(id);
    }

    private DishDto convertToDto(Dish dish) {
        DishDto dto = new DishDto();
        dto.setId(dish.getId());
        dto.setName(dish.getName());
        dto.setDescription(dish.getDescription());
        dto.setPrice(dish.getPrice());
        dto.setImageUrl(dish.getImageUrl());
        dto.setCategory(dish.getCategory());
        dto.setAvailable(dish.isAvailable());
        return dto;
    }

    private Dish convertToEntity(DishDto dto) {
        Dish dish = new Dish();
        dish.setName(dto.getName());
        dish.setDescription(dto.getDescription());
        dish.setPrice(dto.getPrice());
        dish.setImageUrl(dto.getImageUrl());
        dish.setCategory(dto.getCategory());
        dish.setAvailable(dto.isAvailable());
        return dish;
    }
}