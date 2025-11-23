package com.example.hotel.controller;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private ChatModel chatModel;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.getOrDefault("message", "");
            
            if (userMessage.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("response", "Please provide a message.");
                return ResponseEntity.badRequest().body(response);
            }

            // Create a system prompt for Peko (food assistant)
            String systemPrompt = "You are Peko, a friendly food assistant for FreshCart restaurant. " +
                    "Keep responses short and simple (1-2 lines max). " +
                    "Help users with: veg dishes, non-veg dishes, desserts, prices, delivery, and ordering. " +
                    "If user asks irrelevant questions, redirect to food/ordering. " +
                    "Never use emojis. Be professional and concise.";

            String fullPrompt = systemPrompt + "\n\nUser: " + userMessage + "\n\nPeko:";

            Message message = new UserMessage(fullPrompt);
            org.springframework.ai.chat.model.ChatResponse chatResponse = chatModel.call(
                    new Prompt(message)
            );

            String aiResponse = chatResponse.getResult().getOutput().getContent();

            Map<String, String> response = new HashMap<>();
            response.put("response", aiResponse.trim());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("response", "Sorry, I couldn't process that. What food can I help you with?");
            return ResponseEntity.status(500).body(response);
        }
    }
}
