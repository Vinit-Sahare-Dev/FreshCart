package com.example.hotel.service;

import com.example.hotel.dto.OrderItemDto;
import com.example.hotel.dto.OrderRequest;
import com.example.hotel.dto.OrderResponse;
import com.example.hotel.model.Dish;
import com.example.hotel.model.Order;
import com.example.hotel.model.OrderItem;
import com.example.hotel.model.OrderStatus;
import com.example.hotel.model.User;
import com.example.hotel.repository.DishRepository;
import com.example.hotel.repository.OrderRepository;
import com.example.hotel.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DishRepository dishRepository;

    public OrderServiceImpl(OrderRepository orderRepository, 
                           UserRepository userRepository,
                           DishRepository dishRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.dishRepository = dishRepository;
    }

    @Override
    public OrderResponse createOrder(String userEmail, OrderRequest request) {
        // Find user by email (or create a guest user if email is null)
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            // For demo purposes, create or use a default guest user
            user = userRepository.findByEmail("guest@hotel.com")
                    .orElseGet(() -> {
                        User guest = new User();
                        guest.setEmail("guest@hotel.com");
                        guest.setFullName("Guest User");
                        guest.setPassword("N/A");
                        guest.setRole("CUSTOMER");
                        return userRepository.save(guest);
                    });
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus("PENDING");

        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemDto itemDto : request.getItems()) {
            Dish dish = dishRepository.findById(itemDto.getDishId())
                    .orElseThrow(() -> new RuntimeException("Dish not found: " + itemDto.getDishId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(dish);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(itemDto.getPrice());
            orderItems.add(orderItem);
        }
        order.setItems(orderItems);

        // Save order
        Order savedOrder = orderRepository.save(order);

        return convertToResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getOrdersForUser(String userEmail) {
        if (userEmail == null) {
            return new ArrayList<>();
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return orderRepository.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus().name());
        response.setPaymentStatus(order.getPaymentStatus());
        return response;
    }
}