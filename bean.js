document.addEventListener('DOMContentLoaded', function () {
    const userPhoneNumber = localStorage.getItem('phoneNumber');
    const currentUser = localStorage.getItem('username');
    const currentPassword = localStorage.getItem('password');

    const depositKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_deposit`;
    let depositAmount = parseFloat(localStorage.getItem(depositKey)) || 0;

    const activeCardKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_activeCard`;
    let activeCard = JSON.parse(localStorage.getItem(activeCardKey));

    const activeCodeKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_activeCode`;

    function updateButtonStates() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            if (activeCard) {
                btn.innerText = `${activeCard.planName} User`;
                btn.style.backgroundColor = '#28a745';
                btn.style.cursor = 'not-allowed';
                btn.style.pointerEvents = 'none';
            } else {
                btn.innerText = 'Activate Plan';
                btn.style.backgroundColor = '#007bff';
                btn.style.cursor = 'pointer';
                btn.style.pointerEvents = 'auto';
            }
        });
    }

    function showNotification(message, type) {
        const notificationContainer = document.getElementById('notification-container');

        const notificationBox = document.createElement('div');
        notificationBox.className = `notification ${type}`;
        notificationBox.innerHTML = `
            <div class="notification-content">
                <span class="icon">${type === 'success' ? '✔️' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="message">${message}</span>
                <button class="close-btn" onclick="this.parentElement.parentElement.style.display='none';">OK</button>
            </div>
        `;

        notificationContainer.appendChild(notificationBox);

        notificationBox.style.display = 'block';
        notificationBox.style.animation = 'slideDown 0.5s ease';

        setTimeout(() => {
            notificationBox.style.display = 'none';
        }, 5000); // Hide after 5 seconds
    }

    updateButtonStates();

    window.placeOrder = function (planId, price) {
        if (activeCard) {
            showNotification(`Your ${activeCard.planName} membership is already active and will expire on ${new Date(activeCard.expiryDate).toLocaleDateString()}.`, 'info');
            return false;
        }

        if (depositAmount < price) {
            showNotification('Insufficient funds. Please deposit more funds to purchase this membership.', 'error');
            return false;
        }

        const planNames = {
            1: 'Free Membership',
            2: 'Bronze Membership',
            3: 'Premium Membership',
            4: 'Gold Membership'
        };

        const planName = planNames[planId];

        depositAmount -= price;
        localStorage.setItem(depositKey, depositAmount);

        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + 30 * 24 * 60 * 60); // Set expiry date to 30 days from now
        activeCard = { planName, expiryDate: expiryDate.toString() }; // Convert expiryDate to string before storing
        localStorage.setItem(activeCardKey, JSON.stringify(activeCard));

        const activeCode = `${planName}Code`;
        localStorage.setItem(activeCodeKey, activeCode);

        updateButtonStates();

        showNotification(`Your ${planName} membership is activated successfully and will expire on ${expiryDate.toLocaleDateString()}.`, 'success');

        return false;
    };

    function checkCardExpiry() {
        if (activeCard) {
            const now = new Date();
            const expiryDate = new Date(activeCard.expiryDate); // Parse expiryDate string back to Date
            if (now > expiryDate) {
                activeCard = null;
                localStorage.removeItem(activeCardKey);
                localStorage.removeItem(activeCodeKey);
                updateButtonStates();
                showNotification('Your membership has expired.', 'info');
            }
        }
    }

    checkCardExpiry();
    setInterval(checkCardExpiry, 60000);

    // Check on page load if there's an active plan and show notification if true
    if (activeCard) {
        showNotification(`Welcome back! Your ${activeCard.planName} membership is active and will expire on ${new Date(activeCard.expiryDate).toLocaleDateString()}.`, 'info');
    }
});
