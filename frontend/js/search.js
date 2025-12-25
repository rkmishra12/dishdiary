document.addEventListener('DOMContentLoaded', async () => {
    UI.renderNavbar();

    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsGrid = document.getElementById('results-grid');
    const filters = document.querySelectorAll('.filter-select');

    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('query') || '';

    if (searchInput) searchInput.value = initialQuery;

    // Execute Search
    async function executeSearch() {
        const query = searchInput.value.trim();
        const diet = document.getElementById('diet-filter').value;
        const cuisine = document.getElementById('cuisine-filter').value;
        const type = document.getElementById('type-filter').value;
        const maxReadyTime = document.getElementById('time-filter').value;

        // If no search term or filters are provided, don't call the external API
        if (!query && !diet && !cuisine && !type && !maxReadyTime) {
            resultsGrid.innerHTML = '<p class="text-center">Enter a search term or adjust filters to search recipes.</p>';
            return;
        }

        UI.showLoading(resultsGrid);

        try {
            const data = await Api.searchRecipes({ query, diet, cuisine, type, maxReadyTime });
            const recipes = data.results;

            if (!recipes || recipes.length === 0) {
                resultsGrid.innerHTML = '<p class="text-center">No recipes found. Try adjusting your filters.</p>';
                return;
            }

            resultsGrid.innerHTML = recipes.map(recipe => UI.renderRecipeCard(recipe)).join('');
        } catch (err) {
            console.error('Search error:', err);
            // Show more specific error message if available
            const errorMessage = err.message || 'Failed to fetch results.';
            const errorHint = err.hint ? `<br><small>${err.hint}</small>` : '';
            UI.showError(resultsGrid, errorMessage + errorHint);
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', executeSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }

    // Initial search if query exists; otherwise show instructions
    if (initialQuery) {
        executeSearch();
    } else {
        resultsGrid.innerHTML = '<p class="text-center">Enter a search term to find recipes.</p>';
    }
});
