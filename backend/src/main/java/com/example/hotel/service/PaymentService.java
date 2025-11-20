package com.example.hotel.service;

import java.math.BigDecimal;

public interface PaymentService {

    /**
     * Create a payment intent / order with the third-party provider.
     * Replace return type and params with real Stripe/PayPal objects when integrating.
     */
    String createPayment(String orderId, BigDecimal amount);
}
