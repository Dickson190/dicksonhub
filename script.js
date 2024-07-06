document.addEventListener('DOMContentLoaded', function () {
    function showLoginPopup() {
        const popupLogin = document.getElementById('popup-login');
        popupLogin.style.display = 'block';
    }

    function handleLoginOk() {
        const popupLogin = document.getElementById('popup-login');
        popupLogin.style.display = 'none';
        window.location.href = 'app.html';
    }

    window.handleLoginOk = handleLoginOk;

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
        setTimeout(showLoginPopup, 2000);
        return;
    }

    const signupForm = document.getElementById('signup-form');
    const loader = document.getElementById('loader');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        loader.style.display = 'block';

        const formData = new FormData(signupForm);
        fetch(signupForm.action, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            showSignupPopup();
            
            if (rememberMe) {
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
            }
        }).catch(error => {
            loader.style.display = 'none';
            alert('Error: ' + error);
        });
    });

    function showSignupPopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'block';
    }

    function handleOk() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
        window.location.href = 'profile.html';
    }

    window.handleOk = handleOk;
});