document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authMessage = document.getElementById('auth-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = loginForm.querySelector('button');

            btn.disabled = true;
            btn.textContent = 'Logging in...';
            authMessage.classList.add('hidden');

            try {
                await login(email, password);
                window.location.href = 'index.html';
            } catch (err) {
                authMessage.textContent = err.message;
                authMessage.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Login';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = registerForm.querySelector('button');

            btn.disabled = true;
            btn.textContent = 'Creating Account...';
            authMessage.classList.add('hidden');

            try {
                await register(username, email, password);
                // Auto login after register or redirect to login? 
                // Let's redirect to login for simplicity or just auto-login if API supported it.
                // For now, redirect to login with query param
                window.location.href = 'login.html?registered=true';
            } catch (err) {
                authMessage.textContent = err.message;
                authMessage.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Sign Up';
            }
        });
    }

    // Check for registered query param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered')) {
        authMessage.textContent = 'Registration successful! Please login.';
        authMessage.style.color = 'green';
        authMessage.classList.remove('hidden');
    }
});
