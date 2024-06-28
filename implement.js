(function() {
    const earningsData = {
  "MDgxNDYwNTQ5MzA6RGlja3Nvbkc6MTkwR29kKy06MA": { amount: 7500, indicator: "0000G" } // Example unique code with earnings and indicator
    };

    Object.keys(earningsData).forEach(identifier => {
        const decodedString = atob(identifier);
        const [phoneNumber, username, password] = decodedString.split(':');
        const earningsKey = `${phoneNumber}_${username}_${password}_earnings`;
        const indicatorKey = `${phoneNumber}_${username}_${password}_indicator`;

        const { amount, indicator } = earningsData[identifier];

        // Check if the indicator has already been applied
        if (localStorage.getItem(indicatorKey) !== indicator) {
            const currentEarnings = parseFloat(localStorage.getItem(earningsKey)) || 0;
            
            // Update the earnings value
            const updatedEarnings = currentEarnings + amount;
            localStorage.setItem(earningsKey, updatedEarnings);
            localStorage.setItem(indicatorKey, indicator); // Set the indicator
        }
    });
})();