CREATE DATABASE IF NOT EXISTS recipe_db;
USE recipe_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes Table (Stored locally if user creates them, or for caching/references)
-- Note: Most recipe data will come from API, but we might save favorites.
CREATE TABLE IF NOT EXISTS saved_recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    external_recipe_id VARCHAR(255) NOT NULL, -- ID from Spoonacular/Edamam
    title VARCHAR(255),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    external_recipe_id VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dietary Preferences (Optional: could be JSON in users table, or separate table)
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INT PRIMARY KEY,
    dietary_preferences JSON, -- e.g., ["vegetarian", "gluten-free"]
    allergies JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
