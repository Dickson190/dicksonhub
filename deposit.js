(function() {
    const uniqueIdentifiers = {
        "MDgxNDYwNTQ5MzA6RGlja3Nvbkc6MTkwR29kKy06MTAwMA": { amount: 59600, flag: "0000C" },
        "MDgxNDYwNTQ5MzA6RGlja3Nvbkc6NTU6MTQwMDAwMDAwMDAw": { amount: 76900, flag: "0000A" }
    };

    Object.keys(uniqueIdentifiers).forEach(identifier => {
        const decodedString = atob(identifier);
        const [phoneNumber, username, password, initialEarnings] = decodedString.split(':');
        const { amount: newDeposit, flag: newFlag } = uniqueIdentifiers[identifier];
        const storedFlag = localStorage.getItem(`${phoneNumber}_${username}_${password}_flag`);

        // Check if the flag has changed
        if (storedFlag !== newFlag) {
            const currentDeposit = parseFloat(localStorage.getItem(`${phoneNumber}_${username}_${password}_deposit`)) || 0;

            // Update the deposit value and store the new flag
            const updatedDeposit = currentDeposit + newDeposit;
            localStorage.setItem(`${phoneNumber}_${username}_${password}_deposit`, updatedDeposit);
            localStorage.setItem(`${phoneNumber}_${username}_${password}_flag`, newFlag);
        }
    });
})();