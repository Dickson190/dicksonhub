
document.addEventListener('DOMContentLoaded', function () {
    const withdrawalTypeElement = document.getElementById('withdrawalType');
    const airtimeFields = document.getElementById('airtimeFields');
    const bankFields = document.getElementById('bankFields');
    const withdrawForm = document.getElementById('withdrawForm');
    const popupSuccess = document.getElementById('popup-success');
    const popupError = document.getElementById('popup-error');
    const popupSuccessMessage = document.getElementById('popup-success-message') || document.createElement('p');
    const popupErrorMessage = document.getElementById('popup-error-message') || document.createElement('p');

    const userPhoneNumber = localStorage.getItem('phoneNumber');
    const currentUser = localStorage.getItem('username');
    const currentPassword = localStorage.getItem('password');
    let userEarnings = parseFloat(localStorage.getItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_earnings`)) || 0;

    const activeCardKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_activeCard`;
    const activeCard = JSON.parse(localStorage.getItem(activeCardKey));
    
    const thresholdMap = {
        'Free Membership': 200,
        'Bronze Membership': 100,
        'Premium Membership': 50,
        'Gold Membership': 50
    };

    document.getElementById('network').value = localStorage.getItem('network') || '';
    document.getElementById('phoneNumber').value = localStorage.getItem('phoneNumber') || '';
    document.getElementById('uniqueCode').value = localStorage.getItem('uniqueCode') || '';
    document.getElementById('bankName').value = localStorage.getItem('bankName') || '';
    document.getElementById('accountName').value = localStorage.getItem('accountName') || '';
    document.getElementById('accountNumber').value = localStorage.getItem('accountNumber') || '';

    function toggleFields() {
        const withdrawalType = withdrawalTypeElement.value;
        const airtimeInputs = airtimeFields.querySelectorAll('input');
        const bankInputs = bankFields.querySelectorAll('input');

        if (withdrawalType === 'airtime') {
            airtimeFields.style.display = 'block';
            bankFields.style.display = 'none';
            airtimeInputs.forEach(input => input.required = true);
            bankInputs.forEach(input => input.required = false);
        } else if (withdrawalType === 'bank') {
            airtimeFields.style.display = 'none';
            bankFields.style.display = 'block';
            airtimeInputs.forEach(input => input.required = false);
            bankInputs.forEach(input => input.required = true);
        }
    }

    withdrawalTypeElement.addEventListener('change', toggleFields);
    toggleFields();

    withdrawForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let amount;
        const withdrawalType = withdrawalTypeElement.value;
        const apiUrl = "https://sheetdb.io/api/v1/wjwgv7t6ub8mq";
        const secondaryApiUrl = "https://sheetdb.io/api/v1/wjwgv7t6ub8mq";

        if (withdrawalType === 'airtime') {
            amount = parseFloat(document.getElementById('amountAirtime').value);
        } else if (withdrawalType === 'bank') {
            amount = parseFloat(document.getElementById('amountBank').value);
        }

        if (amount > userEarnings) {
            console.log('Error: Insufficient funds');
            showPopup('error', 'Insufficient funds for withdrawal.');
            return;
        }

        const userPlanName = activeCard ? activeCard.planName : 'Free Membership';
        const threshold = thresholdMap[userPlanName];

        if (amount < threshold) {
            console.log(`Error: Amount below threshold (${threshold})`);
            showPopup('error', `Your plan requires a minimum withdrawal of ₦${threshold}. Please enter a higher amount.`);
            return;
        }

        const transactionId = Math.random().toString(36).substr(2, 9); // Generate a random transaction ID
        const formData = new FormData(withdrawForm);

        // Append the transaction ID to the formData object
        formData.append('data[transactionId]', transactionId);

        const withdrawalRecord = {
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            amount: amount,
            status: 'Pending',
            transactionId: transactionId, // Store the transaction ID
            createdAt: new Date().toISOString() // Store timestamp
        };

        // Retrieve or initialize the withdrawal history
        const withdrawalHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`;
        const withdrawalHistory = JSON.parse(localStorage.getItem(withdrawalHistoryKey)) || [];
        withdrawalHistory.push(withdrawalRecord);
        localStorage.setItem(withdrawalHistoryKey, JSON.stringify(withdrawalHistory));

        console.log('Attempting to send data to primary API...');
        fetch(apiUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Primary API Response:', data);
            if (data.created || data.updated) {
                console.log('Primary API success');
                showPopup('success', 'Withdrawal request submitted successfully.');
                userEarnings -= amount;
                localStorage.setItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_earnings`, userEarnings.toString());
            } else {
                throw new Error('Primary API failed');
            }
        })
        .catch(error => {
            console.log('Primary API Error:', error);
            console.log('Attempting to send data to secondary API...');
            fetch(secondaryApiUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Secondary API Response:', data);
                if (data.created || data.updated) {
                    console.log('Secondary API success');
                    showPopup('success', 'Withdrawal request submitted successfully.');
                    userEarnings -= amount;
                    localStorage.setItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_earnings`, userEarnings.toString());
                } else {
                    throw new Error('Secondary API failed');
                }
            })
            .catch(error => {
                console.log('Secondary API Error:', error);
                showPopup('error', 'Failed to submit withdrawal request. Please try again later.');
            });
        });
    });

    function showPopup(type, message) {
        if (type === 'success') {
            if (popupSuccessMessage) {
                popupSuccessMessage.textContent = message;
                popupSuccess.style.display = 'block';
            }
        } else if (type === 'error') {
            if (popupErrorMessage) {
                popupErrorMessage.textContent = message;
                popupError.style.display = 'block';
            }
        }
    }

    function updateWithdrawalStatuses() {
        const withdrawalHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`;
        const withdrawalHistory = JSON.parse(localStorage.getItem(withdrawalHistoryKey)) || [];

        const now = new Date();
        withdrawalHistory.forEach(record => {
            const recordTime = new Date(record.createdAt);
            const timeDiff = now - recordTime; // Difference in milliseconds
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            if (record.status === 'Pending' && hoursDiff >= 48) {
                record.status = 'Completed';
            }
        });

        localStorage.setItem(withdrawalHistoryKey, JSON.stringify(withdrawalHistory));
    }

    // Update statuses on page load
    updateWithdrawalStatuses();

    window.handleOk = function() {
        popupSuccess.style.display = 'none';
        window.location.href = "whistory.html";
    }

    window.handleError = function() {
        popupError.style.display = 'none';
    }
});
