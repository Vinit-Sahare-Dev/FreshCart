package com.example.hotel.config;

import com.example.hotel.model.Dish;
import com.example.hotel.repository.DishRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DishDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DishDataSeeder.class);

    private final DishRepository dishRepository;

    public DishDataSeeder(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    @Override
    public void run(String... args) {
        if (dishRepository.count() > 0) {
            log.info("Dish data already present. Skipping seeding.");
            return;
        }

        log.info("Seeding default dish catalog...");
        List<Dish> dishes = List.of(
                createDish("Paneer Butter Masala", "Cottage cheese in rich tomato gravy with butter", 280, "/veg/paneer-butter-masala.jpg", "veg"),
                createDish("Vegetable Biryani", "Fragrant basmati rice with mixed vegetables and spices", 220, "/veg/vegbiryani.jpg", "veg"),
                createDish("Palak Paneer", "Cottage cheese in creamy spinach gravy", 260, "/veg/palak-paneer.jpg", "veg"),
                createDish("Masala Dosa", "Crispy rice crepe with spiced potato filling", 120, "/veg/masala-dosa.jpg", "veg"),
                createDish("Chole Bhature", "Spicy chickpeas with fluffy fried bread", 180, "/veg/chole-bhature.jpg", "veg"),
                createDish("Vegetable Korma", "Mixed vegetables in rich cashew gravy", 240, "/veg/vegkorma.jpg", "veg"),
                createDish("Aloo Gobi", "Potato and cauliflower cooked with Indian spices", 160, "/veg/aloo-gobi.jpg", "veg"),
                createDish("Baingan Bharta", "Smoky roasted eggplant mashed with spices", 190, "/veg/baingan-bharta.jpg", "veg"),
                createDish("Malai Kofta", "Creamy vegetable dumplings in rich gravy", 290, "/veg/malai-kofta.jpg", "veg"),
                createDish("Dal Makhani", "Creamy black lentils simmered overnight", 200, "/veg/dal-makhani.jpg", "veg"),
                createDish("Butter Chicken", "Tender chicken in rich buttery tomato gravy", 320, "/nonveg/butter-chicken.jpg", "nonveg"),
                createDish("Chicken Biryani", "Fragrant basmati rice with succulent chicken pieces", 280, "/nonveg/chicken-biryani.jpg", "nonveg"),
                createDish("Mutton Rogan Josh", "Kashmiri style lamb curry with aromatic spices", 450, "/nonveg/mutton-rogan-josh.jpg", "nonveg"),
                createDish("Fish Curry", "Spicy coastal style fish in coconut gravy", 380, "/nonveg/fish-curry.jpg", "nonveg"),
                createDish("Chicken Tikka Masala", "Grilled chicken chunks in creamy tomato sauce", 350, "/nonveg/chicken-tikka-masala.jpg", "nonveg"),
                createDish("Egg Curry", "Boiled eggs in spicy onion-tomato gravy", 180, "/nonveg/egg-curry.jpg", "nonveg"),
                createDish("Chicken Korma", "Mild creamy chicken curry with nuts", 300, "/nonveg/chicken-korma.jpg", "nonveg"),
                createDish("Idli", "Steamed rice cakes served with sambar and chutney", 80, "/veg/idli.jpg", "veg"),
                createDish("Sambar Idli", "Steamed idli soaked in spicy lentil sambar", 100, "/veg/sambar-idli.jpg", "veg"),
                createDish("Vada", "Crispy lentil doughnuts with sambar", 90, "/veg/vada.jpg", "veg"),
                createDish("Rava Dosa", "Crispy semolina crepe", 130, "/veg/rava-dosa.jpg", "veg"),
                createDish("Uttapam", "Thick rice pancake with vegetables", 110, "/veg/uttapam.jpg", "veg"),
                createDish("Gulab Jamun", "Soft milk dumplings in sweet rose-flavored syrup", 120, "/dairy/gulab-jamun.jpg", "dairy"),
                createDish("Rasmalai", "Soft cottage cheese patties in sweetened creamy milk", 150, "/dairy/rasmalai.jpg", "dairy"),
                createDish("Kheer", "Creamy rice pudding with nuts and cardamom", 100, "/dairy/kheer.jpg", "dairy"),
                createDish("Mango Lassi", "Refreshing yogurt drink with mango", 80, "/dairy/mango-lassi.jpg", "dairy"),
                createDish("Pista Kulfi", "Traditional Indian ice cream with pistachios", 90, "/dairy/pista-kulfi.jpg", "dairy")
        );

        dishRepository.saveAll(dishes);
        log.info("Seeded {} dishes.", dishes.size());
    }

    private Dish createDish(String name, String description, int price, String imageUrl, String category) {
        return new Dish(name, description, BigDecimal.valueOf(price), imageUrl, category, true);
    }
}
