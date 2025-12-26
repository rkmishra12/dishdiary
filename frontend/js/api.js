const API_BASE = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

function setUser(user) {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}

async function apiRequest(endpoint, method = "GET", body = null) {
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
async function login(email, password) {
  const data = await apiRequest("/auth/login", "POST", { email, password });
  setToken(data.token);
  setUser(data.user);
  return data;
}

async function register(username, email, password) {
  return apiRequest("/auth/register", "POST", { username, email, password });
}

function logout() {
  setToken(null);
  setUser(null);
  window.location.reload();
}

// Recipe functions
async function searchRecipes(query = "") {
  const params = new URLSearchParams(query).toString();
  return apiRequest(`/recipes/search?${params}`);
}

async function getRecipeDetails(id) {
  return apiRequest(`/recipes/${id}`);
}

// Review functions
async function addReview(recipeId, rating, comment) {
  const user = getUser();
  return apiRequest("/reviews", "POST", {
    userId: user.id,
    recipeId,
    rating,
    comment,
  });
}

async function getReviews(recipeId) {
  return apiRequest(`/reviews/${recipeId}`);
}

// User Preference functions
async function getUserPreferences(userId) {
  return apiRequest(`/users/preferences/${userId}`);
}

async function updateUserPreferences(userId, preferences) {
  return apiRequest(`/users/preferences/${userId}`, "PUT", preferences);
}
