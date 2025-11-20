package com.example.hotel.service;

import com.example.hotel.dto.OrderRequest;
import com.example.hotel.dto.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(String userEmail, OrderRequest request);
    List<OrderResponse> getOrdersForUser(String userEmail);
    List<OrderResponse> getAllOrders();
}
