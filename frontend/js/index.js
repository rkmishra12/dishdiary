document.addEventListener('DOMContentLoaded', async () => {
    UI.renderNavbar();

    // Init Logic for Home Page
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

    // Load Featured/Random Recipes
    if (featuredGrid) {
        UI.showLoading(featuredGrid);
        try {
            // "Featured" is just a search for 'healthy' or something generic for now
            const data = await Api.searchRecipes({ query: 'healthy', number: 6 });
            const recipes = data.results; // Spoonacular format

            if (recipes.length === 0) {
                featuredGrid.innerHTML = '<p class="text-center">No recipes found.</p>';
                return;
            }

            featuredGrid.innerHTML = recipes.map(recipe => UI.renderRecipeCard(recipe)).join('');
        } catch (err) {
            UI.showError(featuredGrid, 'Failed to load recipes. Please try again later.');
        }
    }
});
