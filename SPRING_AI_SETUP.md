# Spring AI Setup for Peko Chatbot

## Overview
Peko now uses Spring AI for intelligent, generative responses instead of hardcoded replies. This enables natural language understanding and dynamic responses.

## Prerequisites

1. **OpenAI API Key** (Required)
   - Get from https://platform.openai.com/api-keys
   - Free trial includes credits

## Backend Setup

### 1. Add Configuration to `application.properties`

```properties
# OpenAI Configuration
spring.ai.openai.api-key=${OPENAI_API_KEY}
spring.ai.openai.chat.options.model=gpt-3.5-turbo
spring.ai.openai.chat.options.temperature=0.7
```

### 2. Set Environment Variable

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY = "sk-your-api-key-here"
mvn spring-boot:run
```

**Windows (CMD):**
```cmd
set OPENAI_API_KEY=sk-your-api-key-here
mvn spring-boot:run
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
mvn spring-boot:run
```

### 3. Dependencies Added

- `spring-ai-openai-spring-boot-starter` v1.0.0-M1
- Added Spring Milestones repository to pom.xml

## API Endpoint

**POST** `/api/ai/chat`

### Request Body
```json
{
  "message": "Tell me about paneer dishes"
}
```

### Response
```json
{
  "response": "Peko's response about paneer dishes"
}
```

## Frontend Integration

The React component (`AICompanion.jsx`) automatically calls this endpoint:

```javascript
const getAIResponse = async (userMessage) => {
  const response = await fetch('http://localhost:8080/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  });
  return await response.json();
};
```

## How It Works

1. User sends a message in Peko chat
2. Frontend sends message to Spring AI endpoint
3. Backend creates a system prompt that defines Peko's behavior:
   - Food assistant for FreshCart
   - Keeps responses short and simple
   - Redirects non-food topics to ordering
   - No emojis, professional tone
4. OpenAI GPT processes the message
5. Response is sent back and displayed to user

## Fallback Behavior

If OpenAI API is unavailable or times out, Peko responds with:
- "Sorry, couldn't reach the service. What food would you like?"

## Testing

### Test with cURL
```bash
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Tell me about veg dishes\"}"
```

### Test in Browser
1. Start backend: `mvn spring-boot:run` (in backend folder)
2. Start frontend: `npm run dev` (in root folder)
3. Open Peko chat and send messages

## Troubleshooting

**Issue**: "401 Unauthorized" error
- **Fix**: Check OpenAI API key is valid and set correctly

**Issue**: "Connection refused" to localhost:8080
- **Fix**: Ensure backend is running with `mvn spring-boot:run`

**Issue**: CORS error
- **Fix**: `@CrossOrigin(origins = "*")` is already set in AIController

**Issue**: Slow responses
- **Fix**: Use `gpt-3.5-turbo` (faster) instead of `gpt-4`

## Cost Estimation

- GPT-3.5-turbo: ~$0.0005 per 1000 tokens (~200 words)
- Average chat message: ~50-100 tokens
- Estimated cost: ~$0.00005 per message

## Future Enhancements

- Add response caching for common questions
- Store conversation history in database
- Add sentiment analysis for user feedback
- Implement conversation context memory
- Add rate limiting to control costs

## References

- Spring AI Docs: https://docs.spring.io/spring-ai/docs/
- OpenAI Models: https://platform.openai.com/docs/models
- Spring Boot Integration: https://spring.io/projects/spring-ai
