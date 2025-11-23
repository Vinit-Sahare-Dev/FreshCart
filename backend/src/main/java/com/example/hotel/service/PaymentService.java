// PaymentService.java
package com.example.hotel.service;

import com.example.hotel.dto.PaymentRequest;
import com.example.hotel.dto.PaymentResponse;
import java.math.BigDecimal;
import java.util.Map;

public interface PaymentService {
    String createPayment(String orderId, BigDecimal amount);
    PaymentResponse processPayment(PaymentRequest paymentRequest);
    // Add other payment methods as needed
}
