-- Migration: Add cooking skill level and ingredient preferences to user_preferences table

USE recipe_db;

-- Add new columns to user_preferences table
ALTER TABLE user_preferences 
ADD COLUMN cooking_skill_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
ADD COLUMN ingredient_preferences JSON COMMENT 'List of ingredients to avoid';

-- Verify the changes
DESCRIBE user_preferences;
