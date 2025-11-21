package com.example.hotel.repository;

import com.example.hotel.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByCategory(String category);
    List<Dish> findByAvailableTrue();
    List<Dish> findByCategoryAndAvailableTrue(String category); // Add this method
}