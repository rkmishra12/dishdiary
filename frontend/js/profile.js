import { getUser, getUserPreferences, updateUserPreferences } from './api.js';
import { renderNavbar } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();

    const user = getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const profileContent = document.getElementById('profile-content');

    // Initial Render
    profileContent.innerHTML = `
        <div class="card" style="padding: 24px; text-align: center;">
            <h1 style="margin-bottom: 8px;">Hello, ${user.username}!</h1>
            <p style="color: #666; margin-bottom: 24px;">${user.email}</p>
            <p>Your ID: ${user.id}</p>
            
            <div style="margin-top: 32px; text-align: left;">
                <h2>My Preferences</h2>
                <div id="preferences-container">
                    <p>Loading preferences...</p>
                </div>
            </div>
            
            <div style="margin-top: 32px; text-align: left;">
                <h2>My Favorite Recipes</h2>
                <p style="color: #666;">Coming soon...</p>
            </div>
        </div>
    `;

    loadPreferences(user.id);
});

async function loadPreferences(userId) {
    const container = document.getElementById('preferences-container');
    try {
        const prefs = await getUserPreferences(userId);
        renderPreferencesForm(userId, prefs);
    } catch (err) {
        container.innerHTML = `<p style="color: red;">Error loading preferences: ${err.message}</p>`;
    }
}

function renderPreferencesForm(userId, currentPrefs) {
    const container = document.getElementById('preferences-container');

    // Options lists
    const diets = ['Vegetarian', 'Vegan', 'Gluten Free', 'Ketogenic', 'Paleo'];
    const allergies = ['Dairy', 'Peanut', 'Soy', 'Egg', 'Seafood', 'Tree Nut'];
    const skillLevels = ['beginner', 'intermediate', 'advanced'];

    const userDiets = currentPrefs.dietary_preferences || [];
    const userAllergies = currentPrefs.allergies || [];
    const userSkillLevel = currentPrefs.cooking_skill_level || 'beginner';
    const userIngredientPrefs = currentPrefs.ingredient_preferences || [];

    let html = '<form id="preferences-form" class="mt-md">';

    // Cooking Skill Level Section
    html += '<h3 class="mb-sm">Cooking Skill Level</h3>';
    html += '<select id="skill-level" class="filter-select mb-md" style="width: auto; display: block;">';
    skillLevels.forEach(level => {
        const selected = level === userSkillLevel ? 'selected' : '';
        html += `<option value="${level}" ${selected}>${level.charAt(0).toUpperCase() + level.slice(1)}</option>`;
    });
    html += '</select>';

    // Diets Section
    html += '<h3 class="mb-sm">Dietary Restrictions</h3>';
    html += '<div style="display: flex; gap: 10px; flex-wrap: wrap;" class="mb-md">';
    diets.forEach(diet => {
        const checked = userDiets.includes(diet) ? 'checked' : '';
        html += `
            <label style="display: flex; align-items: center; gap: 8px; background: #f0f0f0; padding: 6px 12px; border-radius: 20px; cursor: pointer;">
                <input type="checkbox" name="diet" value="${diet}" ${checked}>
                ${diet}
            </label>
        `;
    });
    html += '</div>';

    // Allergies Section
    html += '<h3 class="mb-sm">Allergies / Intolerances</h3>';
    html += '<div style="display: flex; gap: 10px; flex-wrap: wrap;" class="mb-md">';
    allergies.forEach(allergy => {
        const checked = userAllergies.includes(allergy) ? 'checked' : '';
        html += `
            <label style="display: flex; align-items: center; gap: 8px; background: #f0f0f0; padding: 6px 12px; border-radius: 20px; cursor: pointer;">
                <input type="checkbox" name="allergy" value="${allergy}" ${checked}>
                ${allergy}
            </label>
        `;
    });
    html += '</div>';

    // Ingredient Preferences (Avoid List) Section
    html += '<h3 class="mb-sm">Ingredients to Avoid</h3>';
    html += '<p class="text-muted mb-sm" style="font-size: 0.9rem;">Enter ingredients separated by commas (e.g., mushrooms, olives, cilantro)</p>';
    html += `<input type="text" id="ingredient-prefs" class="form-input mb-md" value="${userIngredientPrefs.join(', ')}" placeholder="Enter ingredients to avoid...">`;

    html += `
        <button type="submit" class="btn btn-primary mt-md">Save Preferences</button>
        <p id="save-status" class="mt-sm" style="font-size: 0.9em;"></p>
    `;

    html += '</form>';
    container.innerHTML = html;

    // Handle Submit
    document.getElementById('preferences-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('save-status');
        status.textContent = 'Saving...';
        status.style.color = '#777';

        const formData = new FormData(e.target);
        const selectedDiets = formData.getAll('diet');
        const selectedAllergies = formData.getAll('allergy');
        const skillLevel = document.getElementById('skill-level').value;
        const ingredientPrefsInput = document.getElementById('ingredient-prefs').value;
        const ingredientPrefs = ingredientPrefsInput
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        try {
            await updateUserPreferences(userId, {
                dietary_preferences: selectedDiets,
                allergies: selectedAllergies,
                cooking_skill_level: skillLevel,
                ingredient_preferences: ingredientPrefs
            });
            status.textContent = 'Preferences saved successfully!';
            status.style.color = 'green';
        } catch (err) {
            status.textContent = 'Error saving preferences.';
            status.style.color = 'red';
        }
    });
}
