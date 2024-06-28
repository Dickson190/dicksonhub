document.addEventListener('DOMContentLoaded', function() {
    // Function to update the transaction table
    function updateTransactionTable() {
        const transactionTable = document.getElementById('transactionTableBody'); // Assuming tbody has this ID
        transactionTable.innerHTML = ''; // Clear existing rows

        // Retrieve transactions from local storage
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        // Add transactions to the table
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.type}</td>
                <td>${transaction.time}</td>
                <td>${transaction.date}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.details}</td>
            `;
            transactionTable.appendChild(row);
        });
    }

    // Function to add a transaction
    function addTransaction(type, amount, details) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();

        transactions.push({ type, time, date, amount, details });
        localStorage.setItem('transactions', JSON.stringify(transactions));

        updateTransactionTable();
    }

    // Add event listener to the "View More" button if needed
    document.getElementById('viewMoreButton').addEventListener('click', function() {
        // Functionality to view more transactions or perform another action
        // This can be customized based on your needs
        console.log('View More button clicked');
    });

    // Initial call to update the table on page load
    updateTransactionTable();

    // Example of adding a transaction (This can be removed or customized)
    // addTransaction('Deposit', '10000', 'Initial deposit');

    // You can expose addTransaction to global scope if needed
    window.addTransaction = addTransaction;
});