class GoogleAuth {
    constructor(clientId, onLoginSuccess) {
        this.clientId = clientId;
        this.onLoginSuccess = onLoginSuccess;
    }

    initialize() {
        google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleGoogleSignIn.bind(this)
        });
        this.renderButton();
    }

    renderButton() {
        const buttonElement = document.getElementById("googleBtn");
        if (buttonElement) {
            google.accounts.id.renderButton(
                buttonElement,
                { 
                    theme: "filled_blue", 
                    size: "large",
                    width: 280,
                    text: "continue_with"
                }
            );
        }
    }

    async handleGoogleSignIn(response) {
        try {
            const result = await fetch('http://localhost:5000/api/google_login', {
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
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.result));
                
                if (this.onLoginSuccess) {
                    this.onLoginSuccess(data);
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Login failed. Please try again.');
        }
    }
}