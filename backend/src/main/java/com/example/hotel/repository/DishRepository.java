package com.example.hotel.repository;

import com.example.hotel.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByCategoryAndAvailableTrue(String category);
}
