// OrderService.java
package com.example.hotel.service;

import com.example.hotel.dto.OrderRequest;
import com.example.hotel.dto.OrderResponse;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(String email, OrderRequest request);
    OrderResponse getOrderById(Long orderId);
    List<OrderResponse> getOrdersForUser(String email);
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(Long orderId, String status);
    void deleteOrder(Long orderId);
}