document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const storedUniqueCode = localStorage.getItem('uniqueCode');

    document.getElementById('username').value = storedUsername || '';
    document.getElementById('password').value = storedPassword || '';
    document.getElementById('uniqueCode').value = storedUniqueCode || '';

    const profileForm = document.getElementById('profileForm');
    const ageSelect = document.getElementById('age');
    
    for (let i = 13; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        ageSelect.appendChild(option);
    }

    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (storedProfile) {
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
        document.getElementById('lga').value = storedProfile.lga || '';
    } else {
        document.getElementById('age').value = '18';
    }

    let editCount = parseInt(localStorage.getItem('editCount')) || 0;

    if (editCount >= 3) {
        Array.from(document.querySelectorAll('input, select')).forEach(input => {
            input.disabled = true;
        });
        displayNotification('You have reached the maximum number of edits. The fields are now locked.', 'error');
    } else {
        profileForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const userProfile = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                uniqueCode: document.getElementById('uniqueCode').value,
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
                accountNumber: document.getElementById('accountNumber').value,
                lga: document.getElementById('lga').value
            };

            const encodedProfile = btoa(JSON.stringify(userProfile));
            localStorage.setItem('userProfile', encodedProfile);

            editCount++;
            localStorage.setItem('editCount', editCount);

            await sendProfileToAPI(encodedProfile);

            if (editCount >= 3) {
                Array.from(document.querySelectorAll('input, select')).forEach(input => {
                    input.disabled = true;
                });
                displayNotification('You have reached the maximum number of edits. The fields are now locked.', 'error');
            } else {
                displayNotification('Profile updated successfully!', 'success');
            }

            setTimeout(() => {
                window.location.href = 'app.html';
            }, 2000);
        });
    }
});

async function sendProfileToAPI(encodedProfile) {
    const response = await fetch('https://sheetdb.io/api/v1/YOUR_SHEETDB_API_KEY', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { profile: encodedProfile } })
    });
    if (!response.ok) {
        throw new Error('Failed to send profile to API');
    }
}

function displayNotification(message, type) {
    const notificationBox = document.createElement('div');
    notificationBox.className = `notification ${type}`;
    notificationBox.innerHTML = `<i class="fa ${type === 'success' ? 'fa-check' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(notificationBox);
    setTimeout(() => {
        document.body.removeChild(notificationBox);
    }, 5000);
}


