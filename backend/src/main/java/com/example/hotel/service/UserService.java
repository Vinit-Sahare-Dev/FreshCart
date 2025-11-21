package com.example.hotel.service;

import com.example.hotel.model.User;

public interface UserService {
    User registerCustomer(User user);
    User findByEmail(String email);
}
