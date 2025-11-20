package com.example.hotel.service;

import com.example.hotel.dto.DishDto;

import java.util.List;

public interface DishService {
    List<DishDto> getAllDishes();
    List<DishDto> getDishesByCategory(String category);
    DishDto createDish(DishDto dishDto);
    DishDto updateDish(Long id, DishDto dishDto);
    void deleteDish(Long id);
}
