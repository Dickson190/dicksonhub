document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loader = document.getElementById('loader');
    const notificationBox = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationButton = document.getElementById('notification-button');

    let usersData = [];

    const apiUrls = [
        'https://sheetdb.io/api/v1/rv6qbrxgyvk67',
        'https://sheetdb.io/api/v1/nai5zcen7euxf',
        // Add more API URLs here as needed
    ];

    function fetchDataFromApis(apiUrls) {
        return apiUrls.reduce((promise, apiUrl) => {
            return promise.catch(() => {
                return fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) throw new Error(`API failed: ${apiUrl}`);
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`Error fetching user data from ${apiUrl}:`, error);
                        return Promise.reject(error);
                    });
            });
        }, Promise.reject());
    }

    function loadData() {
        fetchDataFromApis(apiUrls)
            .then(data => {
                usersData = Array.isArray(data) ? data : [];
                console.log('Fetched user data:', usersData);
            })
            .catch(() => {
                showNotification('An error occurred while fetching user data. Please try again.');
            });
    }

    loadData();

    function showNotification(message, isSuccess = false) {
        notificationMessage.textContent = message;
        notificationBox.className = `notification ${isSuccess ? 'success' : 'error'}`;
        notificationBox.style.display = 'block';
        notificationButton.style.display = isSuccess ? 'inline-block' : 'none';
        if (isSuccess) {
            notificationButton.addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        } else {
            setTimeout(() => {
                notificationBox.style.display = 'none';
            }, 3000);
        }
    }

    function storeCredentials(username, password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
    }

    function clearCredentials() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    }

    function automaticLogin() {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        if (storedUsername && storedPassword) {
            loader.style.display = 'block';
            setTimeout(() => {
                showNotification('Automatic login successful \u2714️', true);
                window.location.href = 'profile.html';
            }, 2000);
            return true;
        }
        return false;
    }

    if (!automaticLogin()) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const enteredUsername = document.getElementById('username').value;
            const enteredPassword = document.getElementById('password').value;

            if (!enteredUsername || !enteredPassword) {
                showNotification('Username and password are required.');
                return;
            }

            loader.style.display = 'block';

            fetchDataFromApis(apiUrls)
                .then(data => {
                    usersData = Array.isArray(data) ? data : [];
                    const user = usersData.find(user => user['name'] === enteredUsername);

                    if (user && user['password'] === enteredPassword) {
                        storeCredentials(enteredUsername, enteredPassword);
                        showNotification('Login successful \u2714️', true);
                    } else {
                        clearCredentials();
                        showNotification('Incorrect username or password. Please try again.');
                    }

                    loader.style.display = 'none';
                })
                .catch(error => {
                    loader.style.display = 'none';
                    clearCredentials();
                    showNotification('An error occurred. Please try again.');
                    console.error('Error:', error);
                });
        });
    }
});
  
