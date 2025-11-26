package com.example.hotel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final Random random = new Random();

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.getOrDefault("message", "").toLowerCase();
            
            if (userMessage.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("response", "Please provide a message.");
                return ResponseEntity.badRequest().body(response);
            }

            // Simple rule-based responses (mock AI until Spring AI is configured)
            String aiResponse = generateMockResponse(userMessage);

            Map<String, String> response = new HashMap<>();
            response.put("response", aiResponse);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("AI Chat Error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> response = new HashMap<>();
            response.put("response", "Sorry, I couldn't process that. What food can I help you with?");
            return ResponseEntity.status(500).body(response);
        }
    }

    private String generateMockResponse(String message) {
        // Greeting responses
        if (message.matches(".*\\b(hi|hello|hey)\\b.*")) {
            return "Hello! I'm Peko, your food assistant. How can I help you today?";
        }
        
        // Veg dishes
        if (message.matches(".*\\b(veg|vegetarian)\\b.*")) {
            return "We have delicious vegetarian options like Paneer Butter Masala, Vegetable Biryani, and Palak Paneer. What would you like to try?";
        }
        
        // Non-veg dishes
        if (message.matches(".*\\b(non.?veg|chicken|mutton|meat)\\b.*")) {
            return "Our non-veg specials include Butter Chicken, Chicken Biryani, and Mutton Rogan Josh. All freshly prepared!";
        }
        
        // Desserts/Dairy
        if (message.matches(".*\\b(dessert|sweet|dairy)\\b.*")) {
            return "Try our sweet treats like Gulab Jamun, Rasmalai, or Kheer. Perfect to end your meal!";
        }
        
        // Price inquiries
        if (message.matches(".*\\b(price|cost|how much)\\b.*")) {
            return "Our dishes range from ₹100 to ₹450. Veg dishes start at ₹120, non-veg at ₹280. Check the menu for details!";
        }
        
        // Delivery inquiries
        if (message.matches(".*\\b(deliver|delivery)\\b.*")) {
            return "Yes, we deliver! Free delivery on orders above ₹300. Delivery time is 30-45 minutes.";
        }
        
        // Order inquiries
        if (message.matches(".*\\b(order|how to)\\b.*")) {
            return "Simply browse dishes, add to cart, and checkout. You'll need to login first. It's quick and easy!";
        }
        
        // Popular dishes
        if (message.matches(".*\\b(popular|recommend|suggest)\\b.*")) {
            String[] suggestions = {
                "Butter Chicken is our bestseller! Also try Paneer Butter Masala if you prefer vegetarian.",
                "Chicken Biryani is very popular. For veg lovers, Vegetable Biryani is equally delicious!",
                "Try our Mutton Rogan Josh if you like spicy food. It's a customer favorite!"
            };
            return suggestions[random.nextInt(suggestions.length)];
        }
        
        // Spicy food
        if (message.matches(".*\\b(spicy|hot)\\b.*")) {
            return "Love spicy food? Try Mutton Rogan Josh or Chicken 65. We can adjust spice levels too!";
        }
        
        // Thanks
        if (message.matches(".*\\b(thank|thanks)\\b.*")) {
            return "You're welcome! Feel free to ask if you need anything else. Enjoy your meal!";
        }
        
        // Default response
        String[] defaultResponses = {
            "I can help you with our menu, prices, and ordering. What would you like to know?",
            "Ask me about vegetarian, non-veg, or dessert options. I'm here to help!",
            "Looking for something specific? I can recommend dishes or help you order."
        };
        
        return defaultResponses[random.nextInt(defaultResponses.length)];
    }
}