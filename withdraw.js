document.addEventListener('DOMContentLoaded', function () {
    const withdrawalTypeElement = document.getElementById('withdrawalType');
    const airtimeFields = document.getElementById('airtimeFields');
    const bankFields = document.getElementById('bankFields');

    const withdrawForm = document.getElementById('withdrawForm');
    const userPhoneNumber = localStorage.getItem('phoneNumber');
    const currentUser = localStorage.getItem('username');
    const currentPassword = localStorage.getItem('password');
    let userEarnings = parseFloat(localStorage.getItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_earnings`)) || 0;

    // Retrieve stored user details for Airtime and Bank fields
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

        if (withdrawalType === 'airtime') {
            amount = parseFloat(document.getElementById('amountAirtime').value);
        } else if (withdrawalType === 'bank') {
            amount = parseFloat(document.getElementById('amountBank').value);
        }

        if (amount > userEarnings) {
            alert('Insufficient funds for withdrawal');
            return;
        }

        userEarnings -= amount;
        localStorage.setItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_earnings`, userEarnings);

        // Create a withdrawal record
        const now = new Date();
        const record = {
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            amount: amount,
            status: 'Not completed', // or 'Completed' based on your logic
            transactionId: Math.random().toString(36).substr(2, 9) // unique ID
        };

        // Retrieve existing history or create a new array
        let withdrawalHistory = JSON.parse(localStorage.getItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`)) || [];

        // Add the new record to the history
        withdrawalHistory.push(record);

        // Store the updated history back to local storage
        localStorage.setItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`, JSON.stringify(withdrawalHistory));

        // Submit the form
        fetch(withdrawForm.action, {
            method: 'POST',
            body: new FormData(withdrawForm),
            mode: 'no-cors'
        })
        .then(response => {
            alert('Withdrawal request sent successfully');
            window.location.href = 'whistory.html'; // Redirect to withdrawal history page
            // Update the status to 'Completed'
            record.status = 'Completed';
            localStorage.setItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`, JSON.stringify(withdrawalHistory));
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing your withdrawal. Please try again.');

            // Refund the amount in case of error
            userEarnings += amount;
            localStorage.setItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_earnings`, userEarnings);
        });
    });
});