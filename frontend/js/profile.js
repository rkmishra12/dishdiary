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
        <div class="card" style="padding: var(--spacing-xl); text-align: center;">
            <h1 style="margin-bottom: var(--spacing-sm);">Hello, ${user.username}!</h1>
            <p style="color: var(--text-light); margin-bottom: var(--spacing-lg);">${user.email}</p>
            <p>Your ID: ${user.id}</p>
            
            <div style="margin-top: var(--spacing-xl); text-align: left;">
                <h2>My Preferences</h2>
                <div id="preferences-container">
                    <p>Loading preferences...</p>
                </div>
            </div>
            
            <div style="margin-top: var(--spacing-xl); text-align: left;">
                <h2>My Favorite Recipes</h2>
                <p style="color: var(--text-light);">Coming soon...</p>
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

    let html = '<form id="preferences-form">';

    // Cooking Skill Level Section
    html += '<h3 style="margin-top: var(--spacing-md);">Cooking Skill Level</h3>';
    html += '<select id="skill-level" class="form-input" style="width: auto;">';
    skillLevels.forEach(level => {
        const selected = level === userSkillLevel ? 'selected' : '';
        html += `<option value="${level}" ${selected}>${level.charAt(0).toUpperCase() + level.slice(1)}</option>`;
    });
    html += '</select>';

    // Diets Section
    html += '<h3 style="margin-top: var(--spacing-md);">Dietary Restrictions</h3>';
    html += '<div style="display: flex; gap: 10px; flex-wrap: wrap;">';
    diets.forEach(diet => {
        const checked = userDiets.includes(diet) ? 'checked' : '';
        html += `
            <label style="display: flex; align-items: center; gap: 5px;">
                <input type="checkbox" name="diet" value="${diet}" ${checked}>
                ${diet}
            </label>
        `;
    });
    html += '</div>';

    // Allergies Section
    html += '<h3 style="margin-top: var(--spacing-md);">Allergies / Intolerances</h3>';
    html += '<div style="display: flex; gap: 10px; flex-wrap: wrap;">';
    allergies.forEach(allergy => {
        const checked = userAllergies.includes(allergy) ? 'checked' : '';
        html += `
            <label style="display: flex; align-items: center; gap: 5px;">
                <input type="checkbox" name="allergy" value="${allergy}" ${checked}>
                ${allergy}
            </label>
        `;
    });
    html += '</div>';

    // Ingredient Preferences (Avoid List) Section
    html += '<h3 style="margin-top: var(--spacing-md);">Ingredients to Avoid</h3>';
    html += '<p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: var(--spacing-sm);">Enter ingredients separated by commas (e.g., mushrooms, olives, cilantro)</p>';
    html += `<input type="text" id="ingredient-prefs" class="form-input" value="${userIngredientPrefs.join(', ')}" placeholder="Enter ingredients to avoid...">`;

    html += `
        <button type="submit" class="btn btn-primary" style="margin-top: var(--spacing-lg);">Save Preferences</button>
        <p id="save-status" style="margin-top: var(--spacing-sm); font-size: 0.9em;"></p>
    `;

    html += '</form>';
    container.innerHTML = html;

    // Handle Submit
    document.getElementById('preferences-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('save-status');
        status.textContent = 'Saving...';
        status.style.color = 'var(--text-light)';

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
