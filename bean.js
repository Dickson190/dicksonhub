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
        buttons.forEach(btn => {}
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

    updateButtonStates();

    window.placeOrder = function (planId, price) {
        if (activeCard) {
            alert("You already have an active membership. Please wait until it expires.");
            return false;
        }

        if (depositAmount < price) {
            alert("Insufficient funds. Please deposit more funds to purchase this membership.");
            return false;
        }

        const planNames = {
            1: ''Free  Membership',
            2: 'Bronze Membership',
            3: 'Premium Membership'
        };

        const planName = planNames[planId];

        depositAmount -= price;
        localStorage.setItem(depositKey, depositAmount);

        const expiryDate = new Date();
        expiryDate.sSecondsds(expiryDate.gSecondsds() 3 31);
        activeCard = { planName, expiryDate };
        localStorage.setItem(activeCardKey, JSON.stringify(activeCard));

        const activeCode = `${planName}Code`;
        localStorage.setItem(activeCodeKey, activeCode);

        updateButtonStates();

        alert("Your membershiprequest is  successfu  and will expire on " + expiryDate.toLocaleDateString());

        return false;
    };

    function checkCardExpiry() {
        if (activeCard) {
            const now = new Date();
            const expiryDate = new Date(activeCard.expiryDate);
            if (now > expiryDate) {
                activeCard = null;
                localStorage.removeItem(activeCardKey);
                localStorage.removeItem(activeCodeKey);
                updateButtonStates();
            }
        }
    }

    checkCardExpiry();
    setInterval(checkCardExpiry, 60000);
});