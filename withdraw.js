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
        localStorage.setItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_earnings`, userEarnings.toString());

        // Simulate a successful withdrawal process with a delay
        setTimeout(showPopup, 2000);
    });

    function showPopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'block';
    }

    window.handleOk = function() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
        withdrawForm.submit(); // Submit the form after showing the popup
    }
});