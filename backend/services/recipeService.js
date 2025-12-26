import axios from "axios";
import "dotenv/config";

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes";

// Simple in-memory cache
const cache = new Map();

/**
 * Service to handle recipe-related external API calls
 */
export const search = async (filters) => {
    const { query, diet, cuisine, type, maxReadyTime } = filters;

    if (!API_KEY) {
        throw new Error("API_KEY is not set in .env file");
    }

    const cacheKey = `search_${JSON.stringify(filters)}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const params = {
        apiKey: API_KEY,
        addRecipeInformation: true,
        number: 12, // Increased slightly for better grid fill
    };

    if (query) params.query = query;
    if (diet) params.diet = diet;
    if (cuisine) params.cuisine = cuisine;
    if (type) params.type = type;
    if (maxReadyTime) params.maxReadyTime = maxReadyTime;

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });
    const data = response.data;

    // Cache results for 15 minutes
    cache.set(cacheKey, data);
    setTimeout(() => cache.delete(cacheKey), 15 * 60 * 1000);

    return data;
};

export const getDetails = async (id) => {
    if (!API_KEY) {
        throw new Error("API_KEY is not set in .env file");
    }

    const cacheKey = `recipe_${id}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const response = await axios.get(`${BASE_URL}/${id}/information`, {
        params: { apiKey: API_KEY },
    });
    const data = response.data;

    cache.set(cacheKey, data);
    setTimeout(() => cache.delete(cacheKey), 15 * 60 * 1000);

    return data;
};
