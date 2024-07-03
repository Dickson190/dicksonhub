// Define handleOk in the global scope
function handleOk() {
    const nextUrl = document.querySelector('input[name="_next"]').value;
    window.location.href = nextUrl;
}

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
    const depositKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_depositHistory`;

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

            // Retrieve current deposit history
            let depositHistory = JSON.parse(localStorage.getItem(depositKey)) || [];
            
            // Add new deposit record
            const now = new Date();
            depositHistory.push({
                time: now.toLocaleTimeString(),
                date: now.toLocaleDateString(),
                amount,
                bankName: bankNameField.value,
                accountNumber: accountNumberField.value,
                imageUrl,
                fullDate: now.toISOString()
            });
            localStorage.setItem(depositKey, JSON.stringify(depositHistory));

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
});