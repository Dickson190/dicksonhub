document.addEventListener('DOMContentLoaded', function () {
    const depositForm = document.getElementById('paymentForm');
    const bankNameField = document.getElementById('bankName');
    const accountNameField = document.getElementById('accountName');
    const accountNumberField = document.getElementById('accountNumber');
    const transactionDateField = document.getElementById('transactionDate');
    const amountField = document.getElementById('amount');
    const userPhoneNumber = localStorage.getItem('phoneNumber');
    const currentUser = localStorage.getItem('username');
    const currentPassword = localStorage.getItem('password');
    const depositKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_deposit`;
    const depositHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_depositHistory`;

    // Populate bank details from local storage
    bankNameField.value = localStorage.getItem('bankName') || '';
    accountNameField.value = localStorage.getItem('accountName') || '';
    accountNumberField.value = localStorage.getItem('accountNumber') || '';
    transactionDateField.value = new Date().toLocaleString();

    depositForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const amount = parseFloat(amountField.value);

            // Check if the deposit amount is less than ₦200
            if (amount < 200) {
                alert('Minimum deposit amount is ₦200. If you deposit less, the money will not be credited to your account nor refunded.');
                return;
            }

            // Get the image URL after upload
            const imageUrl = await uploadImage();
            document.getElementById('imageUrl').value = imageUrl;

            // Update deposit amount in local storage
            let currentDeposit = parseFloat(localStorage.getItem(depositKey)) || 0;
            currentDeposit += amount;
            localStorage.setItem(depositKey, currentDeposit);

            // Store deposit transaction details
            const depositHistory = JSON.parse(localStorage.getItem(depositHistoryKey)) || [];
            const transactionDate = new Date().toLocaleString();
            depositHistory.push({
                time: transactionDate,
                date: transactionDate.split(',')[0],
                amount: amount,
                bankName: bankNameField.value,
                accountNumber: accountNumberField.value,
                imageUrl: imageUrl // Store image URL for future reference
            });
            localStorage.setItem(depositHistoryKey, JSON.stringify(depositHistory));

            // Show success popup
            showPopup();
        } catch (error) {
            alert('Error processing payment: ' + error.message);
        }
    });

    async function uploadImage() {
        const receipt = document.getElementById('receipt').files[0];
        const formData = new FormData();
        formData.append('image', receipt);

        const response = await fetch('https://api.imgbb.com/1/upload?key=2ff35d435f55b2ba82776a8d23bc26a3', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            return result.data.url;
        } else {
            throw new Error('Image upload failed');
        }
    }

    function showPopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'block';

        setTimeout(() => {
            handleOk();
        }, 5000);
    }

    function handleOk() {
        const nextUrl = document.querySelector('input[name="_next"]').value;
        window.location.href = nextUrl;
    }
});