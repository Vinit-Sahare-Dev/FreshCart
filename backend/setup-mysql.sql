-- MySQL Database Setup Script
-- Run this script in MySQL to set up the database for the backend

-- Create database
CREATE DATABASE IF NOT EXISTS hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (adjust password as needed)
CREATE USER IF NOT EXISTS 'hotel_user'@'localhost' IDENTIFIED BY 'hotel_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON hotel_db.* TO 'hotel_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE hotel_db;

-- The tables will be created automatically by Hibernate/JPA
-- Initial data will be loaded from data.sql

SELECT 'Database setup completed successfully!' AS Status;

