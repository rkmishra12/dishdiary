import * as recipeService from "../services/recipeService.js";

export const searchRecipes = async (req, res) => {
  try {
    const data = await recipeService.search(req.query);
    res.json(data);
  } catch (err) {
    console.error("Search error:", err.message);
    const status = err.response?.status || 500;
    res.status(status).json({
      message: err.message || "Error fetching recipes",
      error: err.response?.data?.message
    });
  }
};

export const getRecipeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await recipeService.getDetails(id);
    res.json(data);
  } catch (err) {
    console.error("Details error:", err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ message: "Error fetching recipe details" });
  }
};
