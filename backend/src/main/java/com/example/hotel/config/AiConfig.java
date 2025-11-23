package com.example.hotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ai.chat.model.ChatModel;

@Configuration
public class AiConfig {

    @Bean
    public ChatModel chatModel() {
        String openAiApiKey = System.getenv("OPENAI_API_KEY");
        ChatModel chatModel = ChatModel.of("openai");
        // Note: The apiKey can be set via environment variables or external config if chaining is unsupported.
        return chatModel;
    }
}
