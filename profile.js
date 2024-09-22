document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.getElementById('profileForm');
    const notificationBox = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationButton = document.getElementById('notification-button');
    const progressBar = document.getElementById('progress-bar');
    const loader = document.getElementById('loader');

    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const uniqueCodeField = document.getElementById('uniqueCode');
    const phoneNumberField = document.getElementById('phoneNumber');
    const lgaField = document.getElementById('lga');
    const accountNameField = document.getElementById('accountName');
    const accountNumberField = document.getElementById('accountNumber');
    const bankNameField = document.getElementById('bankName');
    const ageField = document.getElementById('age');
    const stateField = document.getElementById('state');
    const emailField = document.getElementById('email');
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const genderField = document.getElementById('gender');
    const networkField = document.getElementById('network');
<!-- API SECTION 😊😊😊😊🙌-->
    const primaryApiUrl = 'https://sheetdb.io/api/v1/05zo2s09gbz5x';
    const maxEdits = 3;
    let editCount = parseInt(localStorage.getItem('editCount') || '0');

    function fetchData(apiUrl) {
        return fetch(apiUrl)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching user data:', error);
                return null;
            });
    }

    function loadData(username) {
        if (localStorage.getItem('dataFetched')) return;

        fetchData(primaryApiUrl)
            .then(result => {
                if (result) {
                    const user = result.find(user => user.username === username);
                    if (user) {
                        storeUserDataToLocalStorage(user);
                        populateFieldsFromLocalStorage();
                        showNotification('User data fetched successfully.', true);
                        localStorage.setItem('dataFetched', 'true');
                    } else {
                        showNotification('User not found. Please fill in the profile manually.');
                        profileForm.addEventListener('submit', function(event) {
                            event.preventDefault();
                            const formData = collectFormData();
                            addProfile(formData);
                        });
                    }
                } else {
                    showNotification('Failed to fetch data. Please check the console for errors.');
                }
            })
            .catch(error => {
                console.error('An error occurred while fetching user data:', error);
                showNotification('An error occurred while fetching user data. Please try again.');
            });
    }

    function showNotification(message, isSuccess = false) {
        notificationMessage.textContent = message;
        notificationBox.className = `notification ${isSuccess ? 'success' : 'error'}`;
        notificationBox.style.display = 'block';
        notificationButton.style.display = isSuccess ? 'inline-block' : 'none';
        if (isSuccess) {
            notificationButton.addEventListener('click', () => {
                notificationBox.style.display = 'none';
            });
        } else {
            setTimeout(() => {
                notificationBox.style.display = 'none';
            }, 3000);
        }
    }

    function storeUserDataToLocalStorage(user) {
        for (const key in user) {
            if (user.hasOwnProperty(key)) {
                localStorage.setItem(key, user[key]);
            }
        }
    }

    function populateFieldsFromLocalStorage() {
        const fields = {
            username: usernameField,
            password: passwordField,
            uniqueCode: uniqueCodeField,
            phoneNumber: phoneNumberField,
            lga: lgaField,
            accountName: accountNameField,
            accountNumber: accountNumberField,
            bankName: bankNameField,
            age: ageField,
            state: stateField,
            email: emailField,
            firstName: firstNameField,
            lastName: lastNameField,
            gender: genderField,
            network: networkField
        };

        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                fields[key].value = localStorage.getItem(key) || '';
            }
        }
    }

    function populateAgeOptions() {
        for (let i = 13; i <= 100; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            ageField.appendChild(option);
        }
    }

    function updateProfile(formData) {
        const updateUrl = `${primaryApiUrl}/username/${formData.username}`;
        console.log('Updating profile with data:', formData);
        return fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: [formData] })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Profile update error:', data.error);
                showNotification('Failed to update profile. Please try again.');
            } else {
                console.log('Profile update successful:', data);
                showNotification('Profile updated successfully.', true);
                storeUserDataToLocalStorage(formData);
                incrementEditCount();
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            showNotification('Failed to update profile. Please try again.');
        });
    }

    function addProfile(formData) {
        const addUrl = primaryApiUrl;
        console.log('Adding profile with data:', formData);
        return fetch(addUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: [formData] })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Profile add error:', data.error);
                showNotification('Failed to submit profile. Please try again.');
            } else {
                console.log('Profile add successful:', data);
                showNotification('Profile submitted successfully.', true);
                storeUserDataToLocalStorage(formData);
                incrementEditCount();
            }
        })
        .catch(error => {
            console.error('Error adding profile:', error);
            showNotification('Failed to submit profile. Please try again.');
        });
    }

    function collectFormData() {
        return {
            username: usernameField.value,
            password: passwordField.value,
            uniqueCode: uniqueCodeField.value,
            email: emailField.value,
            firstName: firstNameField.value,
            lastName: lastNameField.value,
            age: ageField.value,
            gender: genderField.value,
            state: stateField.value,
            phoneNumber: phoneNumberField.value,
            network: networkField.value,
            bankName: bankNameField.value,
            accountName: accountNameField.value,
            accountNumber: accountNumberField.value,
            lga: lgaField.value
        };
    }

    function incrementEditCount() {
        editCount++;
        localStorage.setItem('editCount', editCount);
        if (editCount >= maxEdits) {
            lockFields();
        }
    }

    function lockFields() {
        const fields = [usernameField, passwordField, uniqueCodeField, phoneNumberField, lgaField, accountNameField, accountNumberField, bankNameField, ageField, stateField, emailField, firstNameField, lastNameField, genderField, networkField];
        fields.forEach(field => field.setAttribute('disabled', 'disabled'));
    }

    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = collectFormData();

        console.log('FormData before submission:', formData);

        if (localStorage.getItem('username') === usernameField.value) {
            if (allFieldsPopulated()) {
                updateProfile(formData);
            } else {
                addProfile(formData);
            }
        } else {
            addProfile(formData);
        }
    });

    function initialize() {
        populateAgeOptions();
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            populateFieldsFromLocalStorage();
            if (allFieldsPopulated()) {
                showNotification('User data loaded from local storage.');
            } else {
                loadData(storedUsername);
            }
        } else {
            showNotification('No stored username found.');
        }
        if (editCount >= maxEdits) {
            lockFields();
        }
    }

    function allFieldsPopulated() {
        const fields = [
            usernameField, passwordField, uniqueCodeField, phoneNumberField,
            lgaField, accountNameField, accountNumberField, bankNameField,
            ageField, stateField, emailField, firstNameField, lastNameField,
            genderField, networkField
        ];
        return fields.every(field => field.value.trim() !== '');
    }

    initialize();
});
