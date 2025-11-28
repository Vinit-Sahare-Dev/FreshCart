-- Clear existing dishes
DELETE FROM dishes;

-- Vegetarian Dishes
INSERT INTO dishes (name, description, price, image_url, category, available) VALUES
('Paneer Butter Masala', 'Cottage cheese in rich tomato gravy with butter', 280, '/images/paneer-butter-masala.jpg', 'veg', true),
('Vegetable Biryani', 'Fragrant basmati rice with mixed vegetables and spices', 220, '/images/vegbiryani.jpg', 'veg', true),
('Palak Paneer', 'Cottage cheese in creamy spinach gravy', 260, '/images/palak-paneer.jpg', 'veg', true),
('Masala Dosa', 'Crispy rice crepe with spiced potato filling', 120, '/images/masala-dosa.jpg', 'veg', true),
('Chole Bhature', 'Spicy chickpeas with fluffy fried bread', 180, '/images/chole-bhature.jpg', 'veg', true),
('Vegetable Korma', 'Mixed vegetables in rich cashew gravy', 240, '/images/vegkorma.jpg', 'veg', true);

-- Non-Vegetarian Dishes
INSERT INTO dishes (name, description, price, image_url, category, available) VALUES
('Butter Chicken', 'Tender chicken in rich buttery tomato gravy', 320, '/images/butter-chicken.jpg', 'nonveg', true),
('Chicken Biryani', 'Fragrant basmati rice with succulent chicken pieces', 280, '/images/chicken-biryani.jpg', 'nonveg', true),
('Mutton Rogan Josh', 'Kashmiri style lamb curry with aromatic spices', 450, '/images/mutton-rogan-josh.jpg', 'nonveg', true),
('Fish Curry', 'Spicy coastal style fish in coconut gravy', 380, '/images/fish-curry.jpg', 'nonveg', true),
('Chicken Tikka Masala', 'Grilled chicken chunks in creamy tomato sauce', 350, '/images/chicken-tikka-masala.jpg', 'nonveg', true);

-- Dairy & Desserts
INSERT INTO dishes (name, description, price, image_url, category, available) VALUES
('Gulab Jamun', 'Soft milk dumplings in sweet rose-flavored syrup', 120, '/images/gulab-jamun.jpg', 'dairy', true),
('Rasmalai', 'Soft cottage cheese patties in sweetened creamy milk', 150, '/images/rasmalai.jpg', 'dairy', true),
('Kheer', 'Creamy rice pudding with nuts and cardamom', 100, '/images/kheer.jpg', 'dairy', true);