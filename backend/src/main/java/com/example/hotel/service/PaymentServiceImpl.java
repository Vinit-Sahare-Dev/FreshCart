package com.example.hotel.service;

import com.example.hotel.dto.PaymentRequest;
import com.example.hotel.dto.PaymentResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Override
    public String createPayment(String orderId, BigDecimal amount) {
        // Mock payment creation
        return "PAY_" + orderId + "_" + System.currentTimeMillis();
    }

    @Override
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        // Mock payment processing
        PaymentResponse response = new PaymentResponse();
        response.setStatus("SUCCESS");
        response.setMessage("Payment processed successfully");
        response.setPaymentIntentId("PAY_" + paymentRequest.getOrderId() + "_" + System.currentTimeMillis());
        response.setClientSecret("cs_test_mock_secret");
        return response;
    }

    @Override
    public Map<String, Object> verifyPayment(String transactionId, BigDecimal amount) {
        Map<String, Object> result = new HashMap<>();
        
        // Validate transaction ID format
        if (transactionId == null || transactionId.trim().isEmpty()) {
            result.put("verified", false);
            result.put("message", "Transaction ID is required");
            return result;
        }
        
        // Remove spaces and convert to uppercase for validation
        String cleanTransactionId = transactionId.trim().toUpperCase();
        
        // Validate transaction ID format (should be alphanumeric, min 8 chars)
        // Common formats: UPI ref numbers, transaction IDs from payment apps
        if (cleanTransactionId.length() < 8 || !cleanTransactionId.matches("^[A-Z0-9]+$")) {
            result.put("verified", false);
            result.put("message", "Invalid transaction ID format. Please enter a valid transaction reference from your payment app.");
            return result;
        }
        
        // In a real system, this would:
        // 1. Call payment gateway API to verify transaction
        // 2. Check transaction status, amount, and timestamp
        // 3. Verify it matches the expected amount
        
        // For demo purposes, we'll verify:
        // - Transaction ID format is valid
        // - Amount is positive
        // - Transaction ID is not too old (simulated by checking format)
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            result.put("verified", false);
            result.put("message", "Invalid payment amount");
            return result;
        }
        
        // Simulate verification delay (in real system, this would be an API call)
        try {
            Thread.sleep(1000); // Simulate network delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // For demo: Accept transaction IDs that match the pattern
        // In production, verify with actual payment gateway
        result.put("verified", true);
        result.put("message", "Payment verified successfully");
        result.put("transactionId", cleanTransactionId);
        result.put("verifiedAt", System.currentTimeMillis());
        
        return result;
    }
}
