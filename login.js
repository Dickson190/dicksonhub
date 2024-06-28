document.addEventListener('DOMContentLoaded', function () {
        const loginForm = document.getElementById('login-form');
        const loader = document.getElementById('loader');
        const forgotPasswordLink = document.getElementById('forgot-password');

        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        if (storedUsername && storedPassword) {
            // Show loading animation
            loader.style.display = 'block';

            // Simulate automatic login with a 2-second delay
            setTimeout(function () {
                alert('Automatic login successful \u2714️');
                window.location.href = 'app.html';
            }, 2000);
        }

        forgotPasswordLink.addEventListener('click', function (event) {
            event.preventDefault();
            const enteredUsername = prompt('Please enter your username:');

            if (enteredUsername === storedUsername) {
                // Show loading animation
                loader.style.display = 'block';

                // Simulate password retrieval with a 2-second delay
                setTimeout(function () {
                    alert('Your password is: ' + storedPassword);
                    // Hide loading animation
                    loader.style.display = 'none';
                }, 2000);
            } else {
                alert('Incorrect username. Please try again.');
            }
        });

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const enteredUsername = document.getElementById('username').value;
            const enteredPassword = document.getElementById('password').value;

            // Show loading animation
            loader.style.display = 'block';

            setTimeout(function () {
                if (enteredUsername === storedUsername && enteredPassword === storedPassword) {
                    // Display success alert
                    alert('Login successful \u2714️');
                    // Redirect to app page if login details are correct
                    window.location.href = 'app.html';
                } else {
                    alert('Incorrect username or password. Please try again.');
                    // Hide loading animation on incorrect login attempt
                    loader.style.display = 'none';
                }
            }, 2000);
        });
    });