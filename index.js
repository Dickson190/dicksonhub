document.addEventListener('DOMContentLoaded', function () {
  // Function to show the login popup
  function showLoginPopup() {
    const popupLogin = document.getElementById('popup-login');
    popupLogin.style.display = 'block';
  }

  // Function to handle OK button in the login popup
  function handleLoginOk() {
    const popupLogin = document.getElementById('popup-login');
    popupLogin.style.display = 'none';
    window.location.href = 'login.html';
  }

  // Function to show the signup popup
  function showSignupPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
  }

  // Function to handle signup form submission
  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const username = usernameInput.value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    loader.style.display = 'block';

    // Check if username exists
    fetch('https://sheetdb.io/api/v1/rv6qbrxgyvk67')
      .then(response => response.json())
      .then(data => {
        // Ensure the response is an array
        if (Array.isArray(data)) {
          const exists = data.some(entry => entry.name === username);

          if (exists) {
            loader.style.display = 'none';
            usernameError.textContent = 'Username already exists.';
          } else {
            // Prepare the new user data in the required format
            const newData = {
              data: {
                name: username,
                password: password
              }
            };

            // Send POST request to API
            fetch('https://sheetdb.io/api/v1/rv6qbrxgyvk67', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newData)
            })
            .then(response => response.json())
            .then(data => {
              loader.style.display = 'none';
              if (data && data.created === 1) {
                showSignupPopup(); // Show the signup popup

                // Remember username and password if checkbox is checked
                if (rememberMe) {
                  localStorage.setItem('username', username);
                  localStorage.setItem('password', password);
                }
              } else {
                alert('Signup failed, please try again.');
              }
            })
            .catch(error => {
              loader.style.display = 'none';
              alert('Error during signup: ' + error);
            });
          }
        } else {
          loader.style.display = 'none';
          alert('Unexpected response format. Please try again later.');
        }
      }).catch(error => {
        loader.style.display = 'none';
        alert('Error fetching existing usernames: ' + error);
      });
  }

  // Expose functions to global scope
  window.handleLoginOk = handleLoginOk;
  window.showSignupPopup = showSignupPopup;
  window.handleOk = function() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    window.location.href = 'login.html';
  }

  // Check for existing login details in local storage
  const storedUsername = localStorage.getItem('username');
  const storedPassword = localStorage.getItem('password');

  if (storedUsername && storedPassword) {
    setTimeout(showLoginPopup, 2000);
  }

  // Attach event listener for signup form submission
  const signupForm = document.getElementById('signup-form');
  const loader = document.getElementById('loader');
  const usernameInput = document.getElementById('username');
  const usernameError = document.getElementById('username-error');

  signupForm.addEventListener('submit', handleFormSubmit);
});
