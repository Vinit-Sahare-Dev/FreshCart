package com.example.hotel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    // Simple rule-based chatbot since Spring AI is commented out
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.getOrDefault("message", "").toLowerCase().trim();
            
            if (userMessage.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("response", "Please provide a message.");
                return ResponseEntity.badRequest().body(response);
            }

            String aiResponse = generateResponse(userMessage);

            Map<String, String> response = new HashMap<>();
            response.put("response", aiResponse);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("AI Chat Error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> response = new HashMap<>();
            response.put("response", "I'm here to help! Ask me about our menu, prices, or how to order.");
            return ResponseEntity.ok(response);
        }
    }

    private String generateResponse(String message) {
        // Greetings
        if (message.matches(".*(hi|hello|hey|greetings).*")) {
            return "Hello! I'm Peko, your FreshCart food assistant. How can I help you today?";
        }
        
        // Menu questions
        if (message.contains("menu") || message.contains("items") || message.contains("dishes")) {
            return "We have vegetarian dishes, non-veg specials, and delicious dairy desserts. What would you like to know about?";
        }
        
        // Vegetarian
        if (message.contains("veg") && !message.contains("non")) {
            return "Our veg menu includes Paneer Butter Masala (₹280), Vegetable Biryani (₹220), Palak Paneer (₹260), and more!";
        }
        
        // Non-veg
        if (message.contains("non") || message.contains("chicken") || message.contains("mutton") || message.contains("fish")) {
            return "Try our Butter Chicken (₹320), Chicken Biryani (₹280), or Mutton Rogan Josh (₹450)!";
        }
        
        // Desserts/Dairy
        if (message.contains("dessert") || message.contains("sweet") || message.contains("dairy")) {
            return "We have Gulab Jamun (₹120), Rasmalai (₹150), and Kheer (₹100) for dessert!";
        }
        
        // Prices
        if (message.contains("price") || message.contains("cost") || message.contains("expensive") || message.contains("cheap")) {
            return "Our dishes range from ₹100 to ₹450. Most items are between ₹200-₹350.";
        }
        
        // Ordering
        if (message.contains("order") || message.contains("buy") || message.contains("purchase")) {
            return "Browse our menu, add items to cart, and checkout. We accept UPI, cards, and cash on delivery!";
        }
        
        // Delivery
        if (message.contains("deliver") || message.contains("shipping") || message.contains("time")) {
            return "We deliver in 30-45 minutes. Free delivery on orders above ₹300!";
        }
        
        // Payment
        if (message.contains("payment") || message.contains("pay") || message.contains("upi")) {
            return "We accept UPI, Credit/Debit cards, and Cash on Delivery.";
        }
        
        // Help
        if (message.contains("help") || message.contains("support")) {
            return "I can help with menu items, prices, ordering process, and delivery info. What would you like to know?";
        }
        
        // Recommendations
        if (message.contains("recommend") || message.contains("suggest") || message.contains("best")) {
            return "Our bestsellers are Butter Chicken, Paneer Butter Masala, and Chicken Biryani!";
        }
        
        // Default response
        return "I can help you with our menu, prices, ordering, and delivery. What would you like to know?";
    }
}