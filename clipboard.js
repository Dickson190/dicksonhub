// clipboard.js

document.addEventListener("DOMContentLoaded", function () {
    const copyReferralCodeBtn = document.getElementById('copyReferralCode');
    const referralCodeDisplay = document.getElementById('referralCodeDisplay');

    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showAlert('Referral Code Copied to Clipboard!');
    }

    function showAlert(message) {
        const alertPopup = document.createElement('div');
        alertPopup.className = 'alert-popup';
        alertPopup.textContent = message;

        document.body.appendChild(alertPopup);
        setTimeout(() => {
            document.body.removeChild(alertPopup);
        }, 5000); // Alert stays for 5 seconds
    }

    // Event Listener for Copy Button
    copyReferralCodeBtn.addEventListener('click', function () {
        copyToClipboard(referralCodeDisplay.textContent);
    });
});