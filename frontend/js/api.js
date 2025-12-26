// In production, your backend might be on Render, Fly.io, etc.
// For now, we'll use a placeholder that you can swap out.
const API_BASE = "https://dishdiary-sh8n.onrender.com/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function setUser(user) {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}

export async function apiRequest(endpoint, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) config.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

// Auth functions
export async function login(email, password) {
  const data = await apiRequest("/auth/login", "POST", { email, password });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function register(username, email, password) {
  return apiRequest("/auth/register", "POST", { username, email, password });
}

export function logout() {
  setToken(null);
  setUser(null);
  window.location.reload();
}

// Recipe functions
export async function searchRecipes(query = "") {
  // Convert object query to URL params if needed
  const params =
    typeof query === "object"
      ? new URLSearchParams(query).toString()
      : new URLSearchParams(query).toString();
  return apiRequest(`/recipes/search?${params}`);
}

export async function getRecipeDetails(id) {
  return apiRequest(`/recipes/${id}`);
}

// Review functions
export async function addReview(recipeId, rating, comment) {
  const user = getUser();
  return apiRequest("/reviews", "POST", {
    userId: user.id,
    recipeId,
    rating,
    comment,
  });
}

export async function getReviews(recipeId) {
  return apiRequest(`/reviews/${recipeId}`);
}

// User Preference functions
export async function getUserPreferences(userId) {
  return apiRequest(`/users/preferences/${userId}`);
}

export async function updateUserPreferences(userId, preferences) {
  return apiRequest(`/users/preferences/${userId}`, "PUT", preferences);
}

// Default export for backward compatibility
export const Api = {
  getToken,
  setToken,
  getUser,
  setUser,
  apiRequest,
  login,
  register,
  logout,
  searchRecipes,
  getRecipeDetails,
  addReview,
  getReviews,
  getUserPreferences,
  updateUserPreferences,
};

export default Api;
