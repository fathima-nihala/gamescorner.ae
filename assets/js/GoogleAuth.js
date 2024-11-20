
const authConfig = {
    clientId: '98946538407-4k5pr38hpks6rkoiqjklarsrprsf8rhc.apps.googleusercontent.com',
    apiEndpoint: 'http://localhost:5000/api/google_login',
    redirectPath: '/index.html'
};

// Initialize Google Sign-In
function initializeGoogleAuth() {
    try {
        google.accounts.id.initialize({
            client_id: authConfig.clientId,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });

        google.accounts.id.renderButton(
            document.getElementById("googleBtn"),
            {
                theme: "outline",
                size: "large",
                width: 280,
                type: "standard"
            }
        );
    } catch (error) {
        console.error('Error initializing Google Auth:', error);
    }
}

// Handle the response from Google
async function handleGoogleResponse(response) {
    if (response.credential) {
        try {
            const result = await fetch(authConfig.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: response.credential
                })
            });

            const data = await result.json();

            if (data.status) {
                localStorage.setItem('token', data.webtoken);
                localStorage.setItem('user', JSON.stringify({
                    email: data.result.email,
                    name: data.result.name,
                    picture: data.result.picture
                }));

                window.location.href = authConfig.redirectPath;
            } else {
                showError('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Login failed. Please try again.');
        }
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Regular login handler
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Implement your regular login logic here
}

// Password toggle functionality
function initializePasswordToggle() {
    const toggleButton = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            // Toggle icon
            this.classList.toggle('ph-eye-slash');
            this.classList.toggle('ph-eye');
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializePasswordToggle();
    initializeGoogleAuth();
});