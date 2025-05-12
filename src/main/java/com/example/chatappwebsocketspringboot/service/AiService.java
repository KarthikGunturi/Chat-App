package com.example.chatappwebsocketspringboot.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {
    private final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final String API_KEY = "Bearer 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";
    public String askGroq(String question) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", API_KEY);
        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3-70b-8192");
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", question));
        body.put("messages", messages);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, request, Map.class);
            Map content = (Map) ((Map) ((List) response.getBody().get("choices")).get(0)).get("message");
            return content.get("content").toString();
        } catch (Exception e) {
            return "AI failed to respond: " + e.getMessage();
        }
    }
}
