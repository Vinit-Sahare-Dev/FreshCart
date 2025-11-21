package com.example.hotel.dto;

import java.util.List;

import java.math.BigDecimal;

public class OrderRequest {
    private List<OrderItemRequest> items;
    private String deliveryAddress;
    private String paymentMethod;
    private BigDecimal totalAmount;

    // Constructors, getters, and setters
    public OrderRequest() {}

    // Add getters and setters for all fields
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
