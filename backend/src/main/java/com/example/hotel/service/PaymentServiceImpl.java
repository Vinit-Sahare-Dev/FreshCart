package com.example.hotel.service;

import com.example.hotel.dto.PaymentRequest;
import com.example.hotel.dto.PaymentResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

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
}
