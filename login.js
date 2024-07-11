document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loader = document.getElementById('loader');
    const forgotPasswordLink = document.getElementById('forgot-password');

    let usersData = [];

    const apiUrl = 'https:' + '//'+'sheetdb.io/api/v1/op1g6xcfghwt6';
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            usersData = data;
            console.log('Fetched user data:', usersData); // Log the fetched data
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            alert('An error occurred while fetching user data. Please try again.');
        });

    forgotPasswordLink.addEventListener('click', function (event) {
        event.preventDefault();
        const enteredUsername = prompt('Please enter your username:');

        if (!enteredUsername) {
            alert('Username is required.');
            return;
        }

        const user = usersData.find(user => user['name'] === enteredUsername);

        if (user) {
            alert('Your password is: ' + user['password']);
        } else {
            alert('Incorrect username. Please try again.');
        }
    });

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const enteredUsername = document.getElementById('username').value;
        const enteredPassword = document.getElementById('password').value;

        if (!enteredUsername || !enteredPassword) {
            alert('Username and password are required.');
            return;
        }

        // Show loading animation
        loader.style.display = 'block';

        // Match user's input against the fetched data
        const user = usersData.find(user => user['name'] === enteredUsername);

        setTimeout(function () {
            loader.style.display = 'none';

            if (user && user['password'] === enteredPassword) {
                alert('Login successful \u2714️');
                window.location.href = 'app.html';
            } else {
                alert('Incorrect username or password. Please try again.');
            }
        }, 2000);
    });
});