import axios from "axios";
import "dotenv/config";

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes";

// Simple in-memory cache
const cache = new Map();

export const searchRecipes = async (req, res) => {
  const { query, diet, cuisine, type, maxReadyTime } = req.query;

  // Check if API key is configured
  if (!API_KEY) {
    console.error("API_KEY is not set in .env file");
    return res.status(500).json({
      message: "API key not configured. Please add API_KEY to .env file",
    });
  }

  // Create a cache key based on query params
  const cacheKey = `search_${JSON.stringify(req.query)}`;

  if (cache.has(cacheKey)) {
    console.log("Serving from cache");
    return res.json(cache.get(cacheKey));
  }

  try {
    console.log("Searching recipes with:", {
      query,
      diet,
      cuisine,
      type,
      maxReadyTime,
    });

    // Build params object, excluding empty values
    const params = {
      apiKey: API_KEY,
      addRecipeInformation: true,
      number: 10,
    };

    // Only add parameters if they have values
    if (query) params.query = query;
    if (diet) params.diet = diet;
    if (cuisine) params.cuisine = cuisine;
    if (type) params.type = type;
    if (maxReadyTime) params.maxReadyTime = maxReadyTime;

    console.log("Sending params:", params);

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });

    const data = response.data;
    console.log(`Found ${data.results?.length || 0} recipes`);

    // Save to cache (valid for 10 minutes)
    cache.set(cacheKey, data);
    setTimeout(() => cache.delete(cacheKey), 10 * 60 * 1000);

    res.json(data);
  } catch (err) {
    console.error("Error fetching recipes:");
    console.error("Status:", err.response?.status);
    console.error("Message:", err.response?.data || err.message);

    if (err.response?.status === 404) {
      return res.status(404).json({
        message: "Recipe API endpoint not found. Please check your API key.",
      });
    }

    res.status(500).json({
      message: "Error fetching recipes from external API",
      error: err.response?.data?.message || err.message,
    });
  }
};

export const getRecipeDetails = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `recipe_${id}`;

  if (cache.has(cacheKey)) {
    console.log("Serving recipe from cache");
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
      },
    });

    const data = response.data;

    // Save to cache
    cache.set(cacheKey, data);
    setTimeout(() => cache.delete(cacheKey), 10 * 60 * 1000);

    res.json(data);
  } catch (err) {
    console.error("Error fetching recipe details:", err.message);
    res.status(500).json({ message: "Error fetching recipe details" });
  }
};
