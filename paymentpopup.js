// Ensure that the variables and functions from the main script are available here

// Function to show the payment popup
function showPaymentPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const paymentPopup = document.createElement('div');
    paymentPopup.className = 'payment-popup';
    paymentPopup.innerHTML = `
        <p>You have reached the 2GB referral limit. Please pay ₦600 to continue withdrawing.</p>
        <button id="payWithDeposit">Pay with Deposit (₦${userDeposit.toFixed(2)})</button>
        <button id="payWithEarnings">Pay with Earnings (₦${userEarnings.toFixed(2)})</button>
        <button id="cancelPayment">Cancel</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(paymentPopup);

    // Handle payment with deposit
    document.getElementById('payWithDeposit').addEventListener('click', function () {
        if (userDeposit >= withdrawalCharge) {
            deductFromDeposit(withdrawalCharge);
            document.body.removeChild(overlay);
            document.body.removeChild(paymentPopup);
            console.log('Payment with deposit successful.');
            proceedWithWithdrawal();
        } else {
            showAlert('Insufficient deposit balance.');
        }
    });

    // Handle payment with earnings
    document.getElementById('payWithEarnings').addEventListener('click', function () {
        if (userEarnings >= withdrawalCharge) {
            deductFromEarnings(withdrawalCharge);
            document.body.removeChild(overlay);
            document.body.removeChild(paymentPopup);
            console.log('Payment with earnings successful.');
            proceedWithWithdrawal();
        } else {
            showAlert('Insufficient earnings balance.');
        }
    });

    // Handle cancellation of payment
    document.getElementById('cancelPayment').addEventListener('click', function () {
        document.body.removeChild(overlay);
        document.body.removeChild(paymentPopup);
        showAlert('Withdrawal canceled.');
    });
}

// Function to prompt user for payment
function promptForPayment() {
    showPaymentPopup(); // Trigger the payment popup
}

// Function to deduct amount from earnings
function deductFromEarnings(amount) {
    userEarnings -= amount;
    localStorage.setItem(userEarningsKey, userEarnings.toFixed(2));
    console.log(`₦${amount} has been deducted from your earnings.`);
}

// Function to deduct amount from deposit
function deductFromDeposit(amount) {
    userDeposit -= amount;
    localStorage.setItem(userDepositKey, userDeposit.toFixed(2));
    console.log(`₦${amount} has been deducted from your deposit.`);
}

// Function to show an alert
function showAlert(message) {
    const alertPopup = document.createElement('div');
    alertPopup.className = 'alert-popup';
    alertPopup.textContent = message;

    document.body.appendChild(alertPopup);
    setTimeout(() => {
        document.body.removeChild(alertPopup);
    }, 5000); // Alert stays for 5 seconds
}

// Function to proceed with the withdrawal
function proceedWithWithdrawal() {
    // Implement your withdrawal process here
    console.log('Withdrawal process continues.');
    // Example: resetReferralLimit();
    // Example: sendDataToAPI();
}

// Function to check if the referral limit is reached and trigger payment prompt
function checkReferralLimit() {
    // Assuming you have a way to get the current referral limit
    let currentReferralGB = getReferralUsageInGB(); // Replace with your method

    if (currentReferralGB >= referralLimit) {
        promptForPayment();
    }
}

// Example function to simulate referral usage in GB (Replace with your actual method)
function getReferralUsageInGB() {
    // This should be replaced with the actual logic to get referral usage
    return parseFloat(localStorage.getItem('referralUsageInGB')) || 0;
}

// Call this function when you need to check the referral limit (e.g., after a withdrawal attempt)
checkReferralLimit();