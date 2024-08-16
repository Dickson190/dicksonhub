document.addEventListener('DOMContentLoaded', function() {
    (function() {
        const earningsData = {
            "MDgxNDYwNTQ5MzA6RGlja3Nvbkc6MTkwR29kKy06MA": { amount: 7500, indicator: "0000J" }
        };

        Object.keys(earningsData).forEach(identifier => {
            const decodedString = atob(identifier);
            const [phoneNumber, username, password] = decodedString.split(':');
            const earningsKey = `${phoneNumber}_${username}_${password}_earnings`;
            const indicatorKey = `${phoneNumber}_${username}_${password}_indicator`;

            const { amount, indicator } = earningsData[identifier];

            if (localStorage.getItem(indicatorKey) !== indicator) {
                const currentEarnings = parseFloat(localStorage.getItem(earningsKey)) || 0;
                const updatedEarnings = currentEarnings + amount;
                localStorage.setItem(earningsKey, updatedEarnings);
                localStorage.setItem(indicatorKey, indicator);

                // Add a transaction entry
                if (typeof window.addTransaction === 'function') {
                    window.addTransaction('CREDITED', amount, 'Payment received');
                } else {
                    console.error('addTransaction function is not available');
                }
            }
        });
    })();
});