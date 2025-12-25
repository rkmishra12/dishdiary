import db from '../config/db.js';

export const getPreferences = async (req, res) => {
    try {
        const { userId } = req.params;

        const [rows] = await db.query('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);

        if (rows.length === 0) {
            return res.json({ dietary_preferences: [], allergies: [] });
        }

        const prefs = rows[0];
        // Ensure we send back arrays, even if stored as JSON/null
        res.json({
            dietary_preferences: prefs.dietary_preferences || [],
            allergies: prefs.allergies || [],
            cooking_skill_level: prefs.cooking_skill_level || 'beginner',
            ingredient_preferences: prefs.ingredient_preferences || []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching preferences' });
    }
};

export const updatePreferences = async (req, res) => {
    try {
        const { userId } = req.params;
        const { dietary_preferences, allergies, cooking_skill_level, ingredient_preferences } = req.body;

        // Using INSERT ... ON DUPLICATE KEY UPDATE to handle both create and update
        // We ensure arrays are stringified for JSON columns
        const dietJson = JSON.stringify(dietary_preferences || []);
        const allergiesJson = JSON.stringify(allergies || []);
        const ingredientPrefsJson = JSON.stringify(ingredient_preferences || []);
        const skillLevel = cooking_skill_level || 'beginner';

        await db.query(`
            INSERT INTO user_preferences (user_id, dietary_preferences, allergies, cooking_skill_level, ingredient_preferences)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            dietary_preferences = VALUES(dietary_preferences),
            allergies = VALUES(allergies),
            cooking_skill_level = VALUES(cooking_skill_level),
            ingredient_preferences = VALUES(ingredient_preferences)
        `, [userId, dietJson, allergiesJson, skillLevel, ingredientPrefsJson]);

        res.json({ message: 'Preferences updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating preferences' });
    }
};
