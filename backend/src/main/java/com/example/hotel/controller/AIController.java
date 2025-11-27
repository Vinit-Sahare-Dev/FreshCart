package com.example.hotel.controller;

import com.example.hotel.service.OpenAIService;
import com.theokanning.openai.completion.chat.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private OpenAIService openAIService;

    // Store conversation history per session (in production, use Redis or database)
    private final Map<String, List<ChatMessage>> conversationSessions = new HashMap<>();

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        try {
            String userMessage = (String) request.getOrDefault("message", "");
            String sessionId = (String) request.getOrDefault("sessionId", "default");
            
            if (userMessage.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("response", "Please provide a message.");
                response.put("error", true);
                return ResponseEntity.badRequest().body(response);
            }

            // Get or create conversation history for this session
            List<ChatMessage> history = conversationSessions.computeIfAbsent(
                sessionId, k -> new ArrayList<>()
            );

            // Get AI response
            String aiResponse = openAIService.getChatCompletion(userMessage, history);

            // Update conversation history
            history.add(new ChatMessage("user", userMessage));
            history.add(new ChatMessage("assistant", aiResponse));

            // Keep only last 10 messages to prevent token overflow
            if (history.size() > 10) {
                history = new ArrayList<>(history.subList(history.size() - 10, history.size()));
                conversationSessions.put(sessionId, history);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("response", aiResponse);
            response.put("sessionId", sessionId);
            response.put("success", true);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("AI Chat Error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("response", "I'm having technical difficulties. What can I help you with?");
            response.put("error", true);
            response.put("errorMessage", e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/recommend")
    public ResponseEntity<Map<String, String>> getRecommendation(@RequestBody Map<String, String> request) {
        try {
            String preference = request.getOrDefault("preference", "any");
            String dietaryRestriction = request.getOrDefault("dietaryRestriction", "none");

            String recommendation = openAIService.getSmartRecommendation(preference, dietaryRestriction);

            Map<String, String> response = new HashMap<>();
            response.put("recommendation", recommendation);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Recommendation Error: " + e.getMessage());
            
            Map<String, String> response = new HashMap<>();
            response.put("recommendation", "Unable to generate recommendations right now.");
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, String>> clearSession(@PathVariable String sessionId) {
        conversationSessions.remove(sessionId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Session cleared successfully");
        return ResponseEntity.ok(response);
    }
}