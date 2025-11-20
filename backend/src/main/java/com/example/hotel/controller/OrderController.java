package com.example.hotel.controller;

import com.example.hotel.dto.OrderRequest;
import com.example.hotel.dto.OrderResponse;
import com.example.hotel.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "${app.frontend.origin}")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        // TODO: require authenticated user once security is configured
        OrderResponse response = orderService.createOrder(email, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> myOrders(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(orderService.getOrdersForUser(email));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> allOrders() {
        // TODO: restrict to ADMIN role
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
