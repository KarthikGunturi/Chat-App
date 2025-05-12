package com.example.chatappwebsocketspringboot.controller;

import com.example.chatappwebsocketspringboot.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/ask")
    public ResponseEntity<String> askAI(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        String answer = aiService.askGroq(question);
        return ResponseEntity.ok(answer);
    }

}
