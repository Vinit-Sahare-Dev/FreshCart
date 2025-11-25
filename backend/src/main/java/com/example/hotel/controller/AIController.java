package com.example.hotel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AIController {

    // Simple mock AI responses for food-related queries
    private static final Map<String, String> RESPONSES = new HashMap<>();
    
    static {
        // Greeting responses
        RESPONSES.put("hello", "Hello! I'm Peko, your food assistant. I can help you with veg, non-veg, desserts, and ordering. What would you like today?");
        RESPONSES.put("hi", "Hi there! Looking for something delicious? Ask me about our menu!");
        
        // Menu queries
        RESPONSES.put("veg", "We have amazing vegetarian dishes like Paneer Butter Masala (₹280), Veg Biryani (₹220), and Palak Paneer (₹260). Which one interests you?");
        RESPONSES.put("nonveg", "Our non-veg specials include Butter Chicken (₹320), Chicken Biryani (₹280), and Mutton Rogan Josh (₹450). All are chef's recommendations!");
        RESPONSES.put("dessert", "Sweet tooth? Try our Gulab Jamun (₹120), Rasmalai (₹150), or Kheer (₹100). All freshly prepared!");
        RESPONSES.put("dairy", "Our dairy items include Gulab Jamun, Rasmalai, and Kheer. Perfect way to end your meal!");
        
        // Price queries
        RESPONSES.put("price", "Prices range from ₹100 to ₹450. Veg dishes: ₹120-₹290, Non-veg: ₹260-₹450, Desserts: ₹100-₹150.");
        RESPONSES.put("cheap", "Budget-friendly options: Masala Dosa (₹120), Kheer (₹100), Chole Bhature (₹180). Great taste, great value!");
        RESPONSES.put("expensive", "Premium choices: Mutton Rogan Josh (₹450), Fish Curry (₹380), Prawn Fry (₹420). Worth every rupee!");
        
        // Ordering queries
        RESPONSES.put("order", "Easy! Browse our menu, add items to cart, and checkout. We deliver in 30 minutes. GST included at checkout.");
        RESPONSES.put("delivery", "We deliver in 30 minutes or it's free! Standard delivery charges apply. Free delivery on orders above ₹500.");
        RESPONSES.put("payment", "We accept all payment methods: UPI, Cards, Cash on Delivery. 100% secure checkout.");
        
        // Recommendations
        RESPONSES.put("recommend", "Today's special: Butter Chicken with Naan! Also try our signature Paneer Butter Masala. Both are customer favorites!");
        RESPONSES.put("popular", "Most ordered: Chicken Biryani, Butter Chicken, Paneer Butter Masala, and Gulab Jamun. Join hundreds of happy customers!");
        
        // Coupon queries
        RESPONSES.put("coupon", "Use code FRESH10 for 10% off or FRESH50 for flat ₹50 off! Valid on all orders.");
        RESPONSES.put("discount", "Active offers: FRESH10 (10% off) and FRESH50 (₹50 off). Apply at checkout for instant savings!");
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.getOrDefault("message", "").toLowerCase().trim();
            
            if (userMessage.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("response", "Please ask me something! I'm here to help with food orders."));
            }

            // Find matching response
            String response = findBestResponse(userMessage);
            
            return ResponseEntity.ok(Map.of("response", response));
            
        } catch (Exception e) {
            System.err.println("AI Chat Error: " + e.getMessage());
            return ResponseEntity.ok(Map.of(
                "response", 
                "I'm having trouble understanding. Try asking about our veg, non-veg, or dessert menu!"
            ));
        }
    }
    
    private String findBestResponse(String message) {
        // Check for exact keyword matches first
        for (Map.Entry<String, String> entry : RESPONSES.entrySet()) {
            if (message.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        
        // Check for common variations
        if (message.contains("help") || message.contains("assist")) {
            return "I can help you with: 🌱 Veg menu, 🍗 Non-veg dishes, 🍮 Desserts, 💰 Prices, 📦 Ordering, and 🎁 Discounts. What interests you?";
        }
        
        if (message.contains("thank")) {
            return "You're welcome! Enjoy your meal! Need anything else?";
        }
        
        if (message.contains("bye") || message.contains("goodbye")) {
            return "Goodbye! Come back hungry! We're always here to serve delicious food. 🍽️";
        }
        
        // Default response for unrecognized queries
        return "I'm Peko, your food assistant! Ask me about:\n" +
               "🌱 Vegetarian dishes\n" +
               "🍗 Non-veg specials\n" +
               "🍮 Desserts & dairy\n" +
               "💰 Prices & offers\n" +
               "📦 Ordering & delivery\n" +
               "What would you like to know?";
    }
}