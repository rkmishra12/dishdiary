import express from 'express';
const router = express.Router();
import * as recipeController from '../controllers/recipeController.js';

// Search recipes (e.g., /api/recipes/search?query=pasta&diet=vegetarian)
router.get('/search', recipeController.searchRecipes);

// Get specific recipe details by ID
router.get('/:id', recipeController.getRecipeDetails);

export default router;
