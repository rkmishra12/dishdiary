import { searchRecipes } from './api.js';
import UI from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    UI.renderNavbar();

    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-filters');
    const resultsGrid = document.getElementById('results-grid');
    const resultsInfo = document.getElementById('results-info');
    const filterSelects = document.querySelectorAll('.filter-select');

    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('query') || '';

    if (searchInput) searchInput.value = initialQuery;

    /**
     * Get current filter values
     */
    function getFilters() {
        return {
            query: searchInput.value.trim(),
            diet: document.getElementById('diet-filter').value,
            cuisine: document.getElementById('cuisine-filter').value,
            type: document.getElementById('type-filter').value,
            maxReadyTime: document.getElementById('time-filter').value,
        };
    }

    /**
     * Perform the search request
     */
    async function executeSearch() {
        const filters = getFilters();

        // Prevent empty searches
        if (!filters.query && !filters.diet && !filters.cuisine && !filters.type && !filters.maxReadyTime) {
            resultsGrid.innerHTML = `
                <div class="text-center mt-lg w-100">
                    <h3>Explore Delicious Recipes</h3>
                    <p class="text-muted">Enter a search term or try some filters to get started.</p>
                </div>
            `;
            resultsInfo.style.display = 'none';
            return;
        }

        UI.showLoading(resultsGrid);
        resultsInfo.style.display = 'none';

        try {
            const data = await searchRecipes(filters);
            const recipes = data.results || [];

            if (recipes.length === 0) {
                resultsGrid.innerHTML = `
                    <div class="text-center mt-lg w-100">
                        <h3>No recipes found</h3>
                        <p class="text-muted">Try adjusting your filters or search term.</p>
                    </div>
                `;
                return;
            }

            resultsGrid.innerHTML = recipes.map(recipe => UI.renderRecipeCard(recipe)).join('');

            // Show result count
            resultsInfo.textContent = `Showing ${recipes.length} results for "${filters.query || 'selected filters'}"`;
            resultsInfo.style.display = 'block';

        } catch (err) {
            console.error('Search error:', err);
            const errorMessage = err.message || 'Failed to fetch results.';
            UI.showError(resultsGrid, `<strong>Error:</strong> ${errorMessage}<br>Check your internet connection or API configuration.`);
        }
    }

    /**
     * Reset all filters
     */
    function clearFilters() {
        searchInput.value = '';
        filterSelects.forEach(select => select.value = '');
        resultsGrid.innerHTML = '<p class="text-center">Filters cleared. Start searching again!</p>';
        resultsInfo.style.display = 'none';
    }

    // Event Listeners
    if (searchBtn) searchBtn.addEventListener('click', executeSearch);
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }

    // Auto-search when filters change
    filterSelects.forEach(select => {
        select.addEventListener('change', executeSearch);
    });

    // Initial load
    if (initialQuery) {
        executeSearch();
    } else {
        resultsGrid.innerHTML = `
            <div class="text-center mt-lg w-100">
                <p class="text-muted">Ready to cook something new? Start searching above!</p>
            </div>
        `;
    }
});
