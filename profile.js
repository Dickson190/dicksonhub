document.addEventListener('DOMContentLoaded', () => {
    // Retrieve username, password, and unique code from local storage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const storedUniqueCode = localStorage.getItem('uniqueCode');

    // Display retrieved data in the profile form
    document.getElementById('username').value = storedUsername || '';
    document.getElementById('password').value = storedPassword || '';
    document.getElementById('uniqueCode').value = storedUniqueCode || '';

    const profileForm = document.getElementById('profileForm');
    const ageSelect = document.getElementById('age');
    
    // Populate age dropdown
    for (let i = 13; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        ageSelect.appendChild(option);
    }

    // Load stored profile data
    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (storedProfile) {
        // Fill input fields with stored profile data
        document.getElementById('firstName').value = storedProfile.firstName || '';
        document.getElementById('lastName').value = storedProfile.lastName || '';
        document.getElementById('age').value = storedProfile.age || '13';
        document.getElementById('gender').value = storedProfile.gender || '';
        document.getElementById('state').value = storedProfile.state || '';
        document.getElementById('phoneNumber').value = storedProfile.phoneNumber || '';
        document.getElementById('email').value = storedProfile.email || '';
        document.getElementById('network').value = storedProfile.network || '';
        document.getElementById('bankName').value = storedProfile.bankName || '';
        document.getElementById('accountName').value = storedProfile.accountName || '';
        document.getElementById('accountNumber').value = storedProfile.accountNumber || '';
    } else {
        // Set default values if no stored profile data
        document.getElementById('age').value = '18';
    }

    // Retrieve edit count
    let editCount = parseInt(localStorage.getItem('editCount')) || 0;

    // Check if edit limit is reached
    if (editCount >= 10) {
        // Lock all input fields
        Array.from(document.querySelectorAll('input, select')).forEach(input => {
            input.disabled = true;
        });
        alert('You have reached the maximum number of edits. The fields are now locked.');
    } else {
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Store individual fields in local storage
            localStorage.setItem('username', document.getElementById('username').value);
            localStorage.setItem('password', document.getElementById('password').value);
            localStorage.setItem('uniqueCode', document.getElementById('uniqueCode').value);
            localStorage.setItem('firstName', document.getElementById('firstName').value);
            localStorage.setItem('lastName', document.getElementById('lastName').value);
            localStorage.setItem('age', document.getElementById('age').value);
            localStorage.setItem('gender', document.getElementById('gender').value);
            localStorage.setItem('state', document.getElementById('state').value);
            localStorage.setItem('phoneNumber', document.getElementById('phoneNumber').value);
            localStorage.setItem('email', document.getElementById('email').value);
            localStorage.setItem('network', document.getElementById('network').value);
            localStorage.setItem('bankName', document.getElementById('bankName').value);
            localStorage.setItem('accountName', document.getElementById('accountName').value);
            localStorage.setItem('accountNumber', document.getElementById('accountNumber').value);

            const userProfile = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                age: document.getElementById('age').value,
                gender: document.getElementById('gender').value,
                state: document.getElementById('state').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                email: document.getElementById('email').value,
                network: document.getElementById('network').value,
                bankName: document.getElementById('bankName').value,
                accountName: document.getElementById('accountName').value,
                accountNumber: document.getElementById('accountNumber').value
            };

            localStorage.setItem('userProfile', JSON.stringify(userProfile));

            // Increment and store the edit count
            editCount++;
            localStorage.setItem('editCount', editCount);

            alert('Profile saved successfully!');

            if (editCount >= 10) {
                // Lock all input fields
                Array.from(document.querySelectorAll('input, select')).forEach(input => {
                    input.disabled = true;
                });
                alert('You have reached the maximum number of edits. The fields are now locked.');
            }
        });
    }
});