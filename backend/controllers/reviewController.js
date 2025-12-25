import db from '../config/db.js';

export const addReview = async (req, res) => {
    try {
        const { userId, recipeId, rating, comment } = req.body;

        if (!userId || !recipeId || !rating) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await db.query(
            'INSERT INTO reviews (user_id, external_recipe_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, recipeId, rating, comment]
        );

        res.status(201).json({ message: 'Review added successfully', reviewId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { recipeId } = req.params;

        // Join with users table to get username
        const [reviews] = await db.query(
            `SELECT r.*, u.username 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.external_recipe_id = ? 
             ORDER BY r.created_at DESC`,
            [recipeId]
        );

        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
