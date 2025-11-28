// package com.example.hotel.service;

// import com.theokanning.openai.completion.chat.ChatCompletionRequest;
// import com.theokanning.openai.completion.chat.ChatCompletionResult;
// import com.theokanning.openai.completion.chat.ChatMessage;
// import com.theokanning.openai.service.OpenAiService;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
// import org.springframework.stereotype.Service;

// import java.time.Duration;
// import java.util.ArrayList;
// import java.util.List;

// @Service
// @ConditionalOnProperty(name = "openai.api.key", matchIfMissing = false)
// public class OpenAIService {

//     private final OpenAiService openAiService;
//     private static final String SYSTEM_PROMPT = """
//         You are Peko, a friendly and helpful AI food assistant for FreshCart restaurant.

//         Your responsibilities:
//         - Help customers discover delicious dishes from our menu
//         - Provide recommendations based on preferences (veg, non-veg, dairy/desserts, snacks)
//         - Answer questions about ingredients, cooking time, and pricing
//         - Assist with dietary restrictions and allergies
//         - Guide customers through the ordering process
//         - Be enthusiastic about food while remaining professional

//         Our menu categories:
//         1. Vegetarian: Fresh plant-based meals (₹120-₹290)
//         2. Non-Vegetarian: Premium meat dishes (₹180-₹450)
//         3. Dairy & Desserts: Sweet treats (₹100-₹180)
//         4. Snacks: Quick bites and appetizers (₹80-₹200)

//         Guidelines:
//         - Keep responses conversational and friendly
//         - Use emojis sparingly for emphasis
//         - If asked about topics outside food/ordering, politely redirect to your expertise
//         - Suggest dishes based on customer preferences
//         - Mention delivery time estimates (typically 25-40 minutes)
//         - Highlight special features like "Chef's Special" or "Customer Favorite"

//         Remember: You're here to make the food ordering experience delightful!
//         """;

//     public OpenAIService(@Value("${openai.api.key:}") String apiKey) {
//         if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("sk-your-key-here")) {
//             throw new IllegalArgumentException("OpenAI API key is required but not properly configured. Please set openai.api.key in application.properties");
//         }
//         this.openAiService = new OpenAiService(apiKey, Duration.ofSeconds(60));
//     }

//     public String getChatCompletion(String userMessage) {
//         return getChatCompletion(userMessage, new ArrayList<>());
//     }

//     public String getChatCompletion(String userMessage, List<ChatMessage> conversationHistory) {
//         try {
//             List<ChatMessage> messages = new ArrayList<>();

//             // Add system message
//             messages.add(new ChatMessage("system", SYSTEM_PROMPT));

//             // Add conversation history if exists
//             if (conversationHistory != null && !conversationHistory.isEmpty()) {
//                 messages.addAll(conversationHistory);
//             }

//             // Add current user message
//             messages.add(new ChatMessage("user", userMessage));

//             ChatCompletionRequest request = ChatCompletionRequest.builder()
//                     .model("gpt-3.5-turbo")
//                     .messages(messages)
//                     .temperature(0.7)
//                     .maxTokens(500)
//                     .build();

//             ChatCompletionResult result = openAiService.createChatCompletion(request);

//             if (result.getChoices() != null && !result.getChoices().isEmpty()) {
//                 return result.getChoices().get(0).getMessage().getContent();
//             }

//             return "I'm having trouble processing that right now. What dish can I help you find?";

//         } catch (Exception e) {
//             System.err.println("OpenAI API Error: " + e.getMessage());
//             e.printStackTrace();
//             return "I'm temporarily unavailable. Please try again in a moment!";
//         }
//     }

//     public String getSmartRecommendation(String preference, String dietaryRestriction) {
//         String prompt = String.format(
//             "Recommend 3 dishes from FreshCart menu based on: Preference=%s, Dietary Restriction=%s. " +
//             "Keep it brief and mention prices.",
//             preference, dietaryRestriction
//         );
//         return getChatCompletion(prompt);
//     }
// }
