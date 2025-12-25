class UI {
    static renderNavbar() {
        const user = Api.user;
        const navLinks = document.querySelector('.nav-links');

        if (user) {
            navLinks.innerHTML = `
                <a href="index.html">Home</a>
                <a href="search.html">Search</a>
                <a href="profile.html">${user.username}</a>
                <a href="#" onclick="UI.logout(event)">Logout</a>
            `;
        } else {
            navLinks.innerHTML = `
                <a href="index.html">Home</a>
                <a href="search.html">Explore</a>
                <a href="login.html">Login</a>
                <a href="register.html" class="btn btn-primary">Sign Up</a>
            `;
        }
    }

    static logout(e) {
        e.preventDefault();
        Api.logout();
    }

    static renderRecipeCard(recipe) {
        // Handle different data structures from searching vs details vs saved
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

    static showLoading(element) {
        element.innerHTML = '<div class="text-center mt-lg"><p>Loading...</p></div>';
    }

    static showError(element, message) {
        element.innerHTML = `<div class="text-center mt-lg" style="color: var(--accent-color);"><p>${message}</p></div>`;
    }
}
