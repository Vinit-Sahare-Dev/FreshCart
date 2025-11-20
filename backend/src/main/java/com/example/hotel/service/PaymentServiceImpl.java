package com.example.hotel.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Override
    public String createPayment(String orderId, BigDecimal amount) {
        // TODO: Integrate with real payment gateway (Stripe/PayPal)
        // For now, return a mock payment ID
        return "PAYMENT_" + orderId + "_" + System.currentTimeMillis();
    }
}