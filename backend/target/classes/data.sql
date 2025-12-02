-- Clear existing dishes
DELETE FROM dishes;

-- Vegetarian Dishes
INSERT INTO dishes (name, description, price, image_url, category, available) VALUES
('Paneer Butter Masala', 'Cottage cheese in rich tomato gravy with butter', 280, 'public/veg/paneer-butter-masala.jpg', 'veg', true),
('Vegetable Biryani', 'Fragrant basmati rice with mixed vegetables and spices', 220, 'public/veg/vegbiryani.jpg', 'veg', true),
('Palak Paneer', 'Cottage cheese in creamy spinach gravy', 260, 'public/veg/palak-paneer.jpg', 'veg', true),
('Masala Dosa', 'Crispy rice crepe with spiced potato filling', 120, 'public/veg/masala-dosa.jpg', 'veg', true),
('Chole Bhature', 'Spicy chickpeas with fluffy fried bread', 180, 'public/veg/chole-bhature.jpg', 'veg', true),
('Vegetable Korma', 'Mixed vegetables in rich cashew gravy', 240, 'public/veg/vegkorma.jpg', 'veg', true),
('Aloo Gobi', 'Potato and cauliflower cooked with Indian spices', 160, 'public/veg/aloo-gobi.jpg', 'veg', true),
('Baingan Bharta', 'Smoky roasted eggplant mashed with spices', 190, 'public/veg/baingan-bharta.jpg', 'veg', true),
('Malai Kofta', 'Creamy vegetable dumplings in rich gravy', 290, 'public/veg/malai-kofta.jpg', 'veg', true),
('Dal Makhani', 'Creamy black lentils simmered overnight', 200, 'public/veg/dal-makhani.jpg', 'veg', true);

-- Non-Vegetarian Dishes
INSERT INTO dishes (name, description, price, image_url, category, available) VALUES
('Butter Chicken', 'Tender chicken in rich buttery tomato gravy', 320, 'public/nonveg/butter-chicken.jpg', 'nonveg', true),
('Chicken Biryani', 'Fragrant basmati rice with succulent chicken pieces', 280, 'public/nonveg/chicken-biryani.jpg', 'nonveg', true),
('Mutton Rogan Josh', 'Kashmiri style lamb curry with aromatic spices', 450, 'public/nonveg/mutton-rogan-josh.jpg', 'nonveg', true),
('Fish Curry', 'Spicy coastal style fish in coconut gravy', 380, 'public/nonveg/fish-curry.jpg', 'nonveg', true),
('Chicken Tikka Masala', 'Grilled chicken chunks in creamy tomato sauce', 350, 'public/nonveg/chicken-tikka-masala.jpg', 'nonveg', true),
('Egg Curry', 'Boiled eggs in spicy onion-tomato gravy', 180, 'public/nonveg/egg-curry.jpg', 'nonveg', true),
('Chicken Korma', 'Mild creamy chicken curry with nuts', 300, 'public/nonveg/chicken-korma.jpg', 'nonveg', true);

-- South Indian Specials
INSERT INTO dishes (name, description, price, image_url, category, available) VALUES
('Idli', 'Steamed rice cakes served with sambar and chutney', 80, 'public/veg/idli.jpg', 'veg', true),
('Sambar Idli', 'Steamed idli soaked in spicy lentil sambar', 100, 'public/veg/sambar-idli.jpg', 'veg', true),
('Vada', 'Crispy lentil doughnuts with sambar', 90, 'public/veg/vada.jpg', 'veg', true),
('Rava Dosa', 'Crispy semolina crepe', 130, 'public/veg/rava-dosa.jpg', 'veg', true),
('Uttapam', 'Thick rice pancake with vegetables', 110, 'public/veg/uttapam.jpg', 'veg', true);

-- Dairy & Desserts
INSERT INTO dishes (name, description, price, image_url, category, available) VALUES
('Gulab Jamun', 'Soft milk dumplings in sweet rose-flavored syrup', 120, 'public/dairy/gulab-jamun.jpg', 'dairy', true),
('Rasmalai', 'Soft cottage cheese patties in sweetened creamy milk', 150, 'public/dairy/rasmalai.jpg', 'dairy', true),
('Kheer', 'Creamy rice pudding with nuts and cardamom', 100, 'public/dairy/kheer.jpg', 'dairy', true),
('Mango Lassi', 'Refreshing yogurt drink with mango', 80, 'public/dairy/mango-lassi.jpg', 'dairy', true),
('Pista Kulfi', 'Traditional Indian ice cream with pistachios', 90, 'public/dairy/pista-kulfi.jpg', 'dairy', true);