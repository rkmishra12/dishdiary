import { getUser, getRecipeDetails, getReviews, addReview } from './api.js';
import { renderNavbar, showLoading, showError } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar();

    const recipeContent = document.getElementById('recipe-content');
    const reviewsList = document.getElementById('reviews-list');
    const reviewForm = document.getElementById('review-form');

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (!recipeId) {
        window.location.href = 'index.html';
        return;
    }

    // Load Recipe Details
    showLoading(recipeContent);

    try {
        const recipe = await getRecipeDetails(recipeId);

        // Render Details
        const ingredients = recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('');
        const dietTags = (recipe.diets || []).map(d => `<span class="tag">${d}</span>`).join('');

        recipeContent.innerHTML = `
            <div class="recipe-header" style="margin-bottom: 32px;">
                <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px;">
                <div style="margin-top: 24px;">
                    <h1 style="font-size: 2.5rem; margin-bottom: 8px;">${recipe.title}</h1>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                        ${dietTags}
                    </div>
                    <div style="display: flex; gap: 24px; color: #666;">
                        <span>⏱ ${recipe.readyInMinutes} mins</span>
                        <span>👥 Serves ${recipe.servings}</span>
                        <span>❤️ ${recipe.aggregateLikes} likes</span>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
                <div>
                    <h3 style="margin-bottom: 16px;">Ingredients</h3>
                    <ul style="line-height: 1.8; list-style-type: disc; padding-left: 20px;">
                        ${ingredients}
                    </ul>
                </div>
                <div>
                    <h3 style="margin-bottom: 16px;">Instructions</h3>
                    <div class="instructions" style="line-height: 1.8;">
                        ${recipe.instructions || 'No instructions provided.'}
                    </div>
                </div>
            </div>
        `;

        // Load Reviews
        loadReviews(recipeId);

    } catch (err) {
        showError(recipeContent, 'Failed to load recipe details.');
    }

    async function loadReviews(id) {
        try {
            const reviews = await getReviews(id);
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<p class="text-center" style="color: #666;">No reviews yet. Be the first!</p>';
            } else {
                reviewsList.innerHTML = reviews.map(r => `
                    <div class="card" style="padding: 16px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span style="font-weight: 600;">${r.username}</span>
                            <span style="color: #f1c40f;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                        </div>
                        <p>${r.comment}</p>
                        <small style="color: #666;">${new Date(r.created_at).toLocaleDateString()}</small>
                    </div>
                `).join('');
            }
        } catch (err) {
            reviewsList.innerHTML = '<p>Failed to load reviews.</p>';
        }
    }

    if (reviewForm) {
        if (!getUser()) {
            reviewForm.innerHTML = '<p><a href="login.html" style="color: #1a1a1a; font-weight: 600;">Login</a> to write a review.</p>';
        } else {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = reviewForm.querySelector('button');
                const rating = document.getElementById('review-rating').value;
                const comment = document.getElementById('review-comment').value;

                btn.disabled = true;
                try {
                    await addReview(recipeId, rating, comment);
                    reviewForm.reset();
                    loadReviews(recipeId);
                } catch (err) {
                    alert(err.message);
                } finally {
                    btn.disabled = false;
                }
            });
        }
    }
});
