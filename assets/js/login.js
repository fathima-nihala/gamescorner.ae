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

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5002/api/weblogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.webtoken) {
            window.alert('Login successful!');
            localStorage.setItem('webtoken', data.webtoken);
            document.cookie = `webtoken=${data.webtoken}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days expiry

            loginForm.reset();

            setTimeout(() => {
                window.location.href = "index.html"; // Change to the page you want to redirect to after login
            }, 1000);
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'An error occurred. Please try again.');
    }
}
