import { searchRecipes } from './api.js';
import { renderNavbar, renderRecipeCard, showLoading, showError } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar();

    const heroSearchBtn = document.getElementById('hero-search-btn');
    const heroSearchInput = document.getElementById('hero-search-input');
    const featuredGrid = document.getElementById('featured-grid');

    if (heroSearchBtn && heroSearchInput) {
        heroSearchBtn.addEventListener('click', () => {
            const query = heroSearchInput.value.trim();
            if (query) {
                window.location.href = `search.html?query=${encodeURIComponent(query)}`;
            }
        });

        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                heroSearchBtn.click();
            }
        });
    }

    // Load Featured Recipes
    if (featuredGrid) {
        showLoading(featuredGrid);
        try {
            const data = await searchRecipes({ query: 'healthy', number: 6 });
            const recipes = data.results || [];

            if (recipes.length === 0) {
                featuredGrid.innerHTML = '<p class="text-center">No recipes found.</p>';
                return;
            }

            featuredGrid.innerHTML = recipes.map(recipe => renderRecipeCard(recipe)).join('');
        } catch (err) {
            showError(featuredGrid, 'Failed to load recipes. Please try again later.');
        }
    }
});
