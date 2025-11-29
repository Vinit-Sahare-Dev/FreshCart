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
            new Dish("Chole Bhature", "Spicy chickpeas with fluffy fried bread", BigDecimal.valueOf(180), "/images/chole-bhature.jpg", "veg", true),
            new Dish("Vegetable Korma", "Mixed vegetables in rich cashew gravy", BigDecimal.valueOf(240), "/images/vegkorma.jpg", "veg", true),
            new Dish("Aloo Gobi", "Potato and cauliflower cooked with Indian spices", BigDecimal.valueOf(160), "/images/aloo-gobi.jpg", "veg", true),
            new Dish("Baingan Bharta", "Smoky roasted eggplant mashed with spices", BigDecimal.valueOf(190), "/images/baingan-bharta.jpg", "veg", true),
            new Dish("Malai Kofta", "Creamy vegetable dumplings in rich gravy", BigDecimal.valueOf(290), "/images/malai-kofta.jpg", "veg", true),
            new Dish("Dal Makhani", "Creamy black lentils simmered overnight", BigDecimal.valueOf(200), "/images/dal-makhani.jpg", "veg", true),
            new Dish("Mutter Paneer", "Cottage cheese with green peas in tomato gravy", BigDecimal.valueOf(250), "/images/mutter-paneer.jpg", "veg", true),
            new Dish("Vegetable Jalfrezi", "Stir-fried vegetables in spicy tomato sauce", BigDecimal.valueOf(210), "/images/veg-jalfrezi.jpg", "veg", true),
            new Dish("Rajma Masala", "Kidney beans in rich onion-tomato gravy", BigDecimal.valueOf(170), "/images/rajma-masala.jpg", "veg", true),
            new Dish("Gobi Manchurian", "Crispy cauliflower in tangy Chinese sauce", BigDecimal.valueOf(190), "/images/gobi-manchurian.jpg", "veg", true),
            new Dish("Paneer Tikka", "Grilled cottage cheese cubes with spices", BigDecimal.valueOf(270), "/images/paneer-tikka.jpg", "veg", true),
            new Dish("Vegetable Pulao", "Fragrant rice with assorted vegetables", BigDecimal.valueOf(150), "/images/veg-pulao.jpg", "veg", true),
            new Dish("Aloo Matar", "Potatoes and peas in spicy gravy", BigDecimal.valueOf(140), "/images/aloo-matar.jpg", "veg", true),
            new Dish("Bhindi Masala", "Okra cooked with onions and spices", BigDecimal.valueOf(160), "/images/bhindi-masala.jpg", "veg", true),
            new Dish("Mushroom Matar", "Mushrooms and peas in creamy gravy", BigDecimal.valueOf(230), "/images/mushroom-matar.jpg", "veg", true),
            new Dish("Vegetable Handi", "Mixed vegetables cooked in clay pot", BigDecimal.valueOf(260), "/images/veg-handi.jpg", "veg", true),

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