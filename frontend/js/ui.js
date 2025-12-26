import { getUser, logout } from './api.js';

export function renderNavbar() {
    const user = getUser();
    const navLinks = document.querySelector('.nav-links');

    if (user) {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="search.html">Search</a>
            <a href="profile.html">${user.username}</a>
            <a href="#" id="logout-link">Logout</a>
        `;
        document.getElementById('logout-link').onclick = (e) => {
            e.preventDefault();
            logout();
        };
    } else {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="search.html">Explore</a>
            <a href="login.html">Login</a>
            <a href="register.html" class="btn btn-primary">Sign Up</a>
        `;
    }
}

export function handleLogout(e) {
    e.preventDefault();
    logout();
}

export function renderRecipeCard(recipe) {
    const id = recipe.id;
    const title = recipe.title;
    const image = recipe.image;
    const time = recipe.readyInMinutes ? `${recipe.readyInMinutes}m` : '';
    const healthScore = recipe.healthScore ? `Health: ${recipe.healthScore}` : '';

    return `
        <div class="card" onclick="window.location.href='recipe.html?id=${id}'" style="cursor: pointer;">
            <img src="${image}" alt="${title}" class="card-img">
            <div class="card-body">
                <h3 class="card-title">${title}</h3>
                <div class="card-meta">
                    <span>${time}</span>
                    <span>${healthScore}</span>
                </div>
            </div>
        </div>
    `;
}

export function showLoading(element) {
    element.innerHTML = '<div class="text-center mt-lg"><p>Loading...</p></div>';
}

export function showError(element, message) {
    element.innerHTML = `<div class="text-center mt-lg" style="color: #d9534f;"><p>${message}</p></div>`;
}

export const UI = {
    renderNavbar,
    handleLogout,
    renderRecipeCard,
    showLoading,
    showError
};

export default UI;
