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
    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('username-error');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = usernameInput.value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        loader.style.display = 'block';

        fetch(`https://sheetdb.io/api/v1/op1g6xcfghwt6/search?data[name]=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    loader.style.display = 'none';
                    usernameError.textContent = 'Username already exists.';
                } else {
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