package com.example.hotel.controller;

import com.example.hotel.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "${app.frontend.origin}")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPayment(@RequestParam String orderId,
                                                             @RequestParam BigDecimal amount) {
        String clientSecretOrId = paymentService.createPayment(orderId, amount);
        return ResponseEntity.ok(Map.of("paymentId", clientSecretOrId));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestParam String transactionId,
                                                             @RequestParam BigDecimal amount) {
        Map<String, Object> verificationResult = paymentService.verifyPayment(transactionId, amount);
        
        if ((Boolean) verificationResult.get("verified")) {
            return ResponseEntity.ok(verificationResult);
        } else {
            return ResponseEntity.badRequest().body(verificationResult);
        }
    }

    // TODO: Add webhook endpoint once integrating real payment provider
}
