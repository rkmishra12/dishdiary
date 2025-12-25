import express from 'express';
const router = express.Router();
import * as reviewController from '../controllers/reviewController.js';

// Add a review (requires auth in real app, but for now simple)
router.post('/', reviewController.addReview);

// Get reviews for a specific recipe
router.get('/:recipeId', reviewController.getReviews);

export default router;
