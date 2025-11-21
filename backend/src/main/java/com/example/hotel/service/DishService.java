package com.example.hotel.service;

import com.example.hotel.dto.DishDTO;
import java.util.List;

public interface DishService {
    List<DishDTO> getAllDishes();
    DishDTO getDishById(Long id);
    DishDTO createDish(DishDTO dishDTO);
    DishDTO updateDish(Long id, DishDTO dishDTO);
    void deleteDish(Long id);
    List<DishDTO> getDishesByCategory(String category);
}