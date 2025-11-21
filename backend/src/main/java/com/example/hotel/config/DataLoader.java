// backend/src/main/java/com/example/hotel/config/DataLoader.java
package com.example.hotel.config;

import com.example.hotel.model.Dish;
import com.example.hotel.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private DishRepository dishRepository;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        dishRepository.deleteAll();
        
        // Create sample dishes
        List<Dish> dishes = Arrays.asList(
            // Vegetarian dishes
            new Dish("Paneer Butter Masala", "Cottage cheese in rich tomato gravy with butter", BigDecimal.valueOf(280), "/images/paneer-butter-masala.jpg", "veg", true),
            new Dish("Vegetable Biryani", "Fragrant basmati rice with mixed vegetables and spices", BigDecimal.valueOf(220), "/images/vegbiryani.jpg", "veg", true),
            new Dish("Palak Paneer", "Cottage cheese in creamy spinach gravy", BigDecimal.valueOf(260), "/images/palak-paneer.jpg", "veg", true),
            new Dish("Masala Dosa", "Crispy rice crepe with spiced potato filling", BigDecimal.valueOf(120), "/images/masala-dosa.jpg", "veg", true),

            // Non-vegetarian dishes
            new Dish("Butter Chicken", "Tender chicken in rich buttery tomato gravy", BigDecimal.valueOf(320), "/images/butter-chicken.jpg", "nonveg", true),
            new Dish("Chicken Biryani", "Fragrant basmati rice with succulent chicken pieces", BigDecimal.valueOf(280), "/images/chicken-biryani.jpg", "nonveg", true),
            new Dish("Mutton Rogan Josh", "Kashmiri style lamb curry with aromatic spices", BigDecimal.valueOf(450), "/images/mutton-rogan-josh.jpg", "nonveg", true),

            // Desserts
            new Dish("Gulab Jamun", "Soft milk dumplings in sweet rose-flavored syrup", BigDecimal.valueOf(120), "/images/gulab-jamun.jpg", "dairy", true),
            new Dish("Rasmalai", "Soft cottage cheese patties in sweetened creamy milk", BigDecimal.valueOf(150), "/images/rasmalai.jpg", "dairy", true)
        );
        
        // Save all dishes
        dishRepository.saveAll(dishes);
        System.out.println("Sample dishes loaded successfully!");
    }
}