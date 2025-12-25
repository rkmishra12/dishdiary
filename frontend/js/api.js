const API_BASE = 'https://dishdiary-sh8n.onrender.com/api';

class Api {
    static get token() {
        return localStorage.getItem('token');
    }

    static set token(token) {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }

    static get user() {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
    }

    static set user(user) {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    }

    static async request(endpoint, method = 'GET', body = null) {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) config.body = JSON.stringify(body);

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, config);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong');
            return data;
        } catch (err) {
            console.error('API Error:', err);
            throw err;
        }
    }

    // Auth
    static async login(email, password) {
        const data = await this.request('/auth/login', 'POST', { email, password });
        this.token = data.token;
        this.user = data.user;
        return data;
    }

    static async register(username, email, password) {
        return this.request('/auth/register', 'POST', { username, email, password });
    }

    static logout() {
        this.token = null;
        this.user = null;
        window.location.reload();
    }

    // Recipes
    static async searchRecipes(query = '') {
        // Build query string
        const params = new URLSearchParams(query).toString();
        return this.request(`/recipes/search?${params}`);
    }

    static async getRecipeDetails(id) {
        return this.request(`/recipes/${id}`);
    }

    // Reviews
    static async addReview(recipeId, rating, comment) {
        return this.request('/reviews', 'POST', {
            userId: this.user.id,
            recipeId,
            rating,
            comment
        });
    }

    static async getReviews(recipeId) {
        return this.request(`/reviews/${recipeId}`);
    }

    // User Preferences
    static async getUserPreferences(userId) {
        return this.request(`/users/preferences/${userId}`);
    }

    static async updateUserPreferences(userId, preferences) {
        return this.request(`/users/preferences/${userId}`, 'PUT', preferences);
    }
}
