document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Collect user input
        const name = document.getElementById('usernameTwo').value.trim();
        const email = document.getElementById('emailTwo').value.trim();
        const password = document.getElementById('enter-password').value.trim();

        // Basic validation
        if (!name || !email || !password) {
            alert('Please fill in all required fields!');
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        try {
            const response = await fetch('http://localhost:5000/api/web_reg', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                // Registration success
                alert('Registration successful!');
                console.log('User registered:', result.user);
                form.reset();
            } else {
                // Handle server-side errors
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});