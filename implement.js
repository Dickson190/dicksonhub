document.addEventListener('DOMContentLoaded', function() {
    (function() {
        const earningsData = {
            "MDgxNDYwNTQ5MzA6RGlja3Nvbkc6MTkwR29kKy06MA": { amount: 7500, indicator: "0000K" },
            "MDI4Mzg1ODpDYXJwOjE6ODM5NTg=": { amount: 18679, indicator: "0000C" },
            "MDgwOTk5MjY0MzU6TmFtcDoxOjA=":{ amount: 320, indicator: "000A"}
        };

        const currentUser = localStorage.getItem('username'); // Assuming 'uniqueCode' stores the current username

        Object.keys(earningsData).forEach(identifier => {
            const decodedString = atob(identifier);
            const [phoneNumber, username, password] = decodedString.split(':');
            const earningsKey = `${phoneNumber}_${username}_${password}_earnings`;
            const indicatorKey = `${phoneNumber}_${username}_${password}_indicator`;

            const { amount, indicator } = earningsData[identifier];

            // Only process if the current user matches the username in earningsData
            if (username === currentUser && localStorage.getItem(indicatorKey) !== indicator) {
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