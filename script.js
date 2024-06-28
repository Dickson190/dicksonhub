 document.addEventListener('DOMContentLoaded', function () {
        // Check if there is an existing username and password in local storage
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        if (storedUsername && storedPassword) {
            // Simulate automatic login with a 2-second delay
            setTimeout(function () {
                alert('Automatic login successful \u2714️');
                window.location.href = 'app.html';
            }, 2000);
            return;
        }

        const signupForm = document.getElementById('signup-form');
        const loader = document.getElementById('loader');

        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Show loading animation
            loader.style.display = 'block';

            // Simulate sign-up process with a 2-second delay
            setTimeout(function () {
                // Store user info in local storage
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);

                // Hide loading animation
                loader.style.display = 'none';

                // Display success alert
                alert('Sign up successful \u2714️');

                // Redirect to profile page after sign-up
                window.location.href = 'profile.html';
            }, 2000);
        });
    });