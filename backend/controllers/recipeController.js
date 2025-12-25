import axios from 'axios';
import 'dotenv/config';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Simple in-memory cache
const cache = new Map();

export const searchRecipes = async (req, res) => {
    const { query, diet, cuisine, type, maxReadyTime } = req.query;

    // Create a cache key based on query params
    const cacheKey = `search_${JSON.stringify(req.query)}`;

    if (cache.has(cacheKey)) {
        console.log('Serving from cache');
        return res.json(cache.get(cacheKey));
    }

    try {
        const response = await axios.get(`${BASE_URL}/complexSearch`, {
            params: {
                apiKey: API_KEY,
                query: query,
                diet: diet,
                cuisine: cuisine,
                type: type,
                maxReadyTime: maxReadyTime,
                addRecipeInformation: true, // Get more details for cards
                number: 10 // Limit results
            }
        });

        const data = response.data;

        // Save to cache (valid for 10 minutes)
        cache.set(cacheKey, data);
        setTimeout(() => cache.delete(cacheKey), 10 * 60 * 1000);

        res.json(data);
    } catch (err) {
        console.error('Error fetching recipes:', err.message);
        res.status(500).json({ message: 'Error fetching recipes from external API' });
    }
};

export const getRecipeDetails = async (req, res) => {
    const { id } = req.params;
    const cacheKey = `recipe_${id}`;

    if (cache.has(cacheKey)) {
        console.log('Serving recipe from cache');
        return res.json(cache.get(cacheKey));
    }

    try {
        const response = await axios.get(`${BASE_URL}/${id}/information`, {
            params: {
                apiKey: API_KEY
            }
        });

        const data = response.data;

        // Save to cache
        cache.set(cacheKey, data);
        setTimeout(() => cache.delete(cacheKey), 10 * 60 * 1000);

        res.json(data);
    } catch (err) {
        console.error('Error fetching recipe details:', err.message);
        res.status(500).json({ message: 'Error fetching recipe details' });
    }
};
