document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.toggle-password').addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.remove('ph-eye-slash');
            this.classList.add('ph-eye');
        } else {
            passwordInput.type = 'password';
            this.classList.remove('ph-eye');
            this.classList.add('ph-eye-slash');
        }
    });
});

// Login handler function
async function handleLogin() {
    const loginForm = document.getElementById('loginForm');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Send login request
        const response = await fetch('http://localhost:5000/api/weblogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // Check for successful login
        if (response.ok && data.webtoken) {
            window.alert('Login successful!');
            localStorage.setItem('webtoken', data.webtoken);
            document.cookie = `webtoken=${data.webtoken}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days expiry

            // Reset the login form
            loginForm.reset();

            // Redirect to homepage (or another page after login)
            setTimeout(() => {
                window.location.href = "index.html"; // Change to the page you want to redirect to after login
            }, 1000);
        } else {
            // If login failed, show error message
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        // Handle any error (e.g., network issues)
        console.error('Error:', error);
        alert(error.message || 'An error occurred. Please try again.');
    }
}
