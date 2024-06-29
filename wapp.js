document.addEventListener('DOMContentLoaded', function() {
    const transactionsPerPage = 5;
    let showingAllTransactions = false;

    // Function to update the transaction table
    function updateTransactionTable() {
        const transactionTable = document.getElementById('transactionTableBody');
        transactionTable.innerHTML = ''; // Clear existing rows

        // Retrieve transactions, withdrawals, and deposits from local storage
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const withdrawals = getWithdrawalHistory();
        const deposits = getDepositHistory();

        // Combine all entries and sort by the most recent date and time
        const allEntries = [...transactions, ...withdrawals, ...deposits].sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));

        // Determine the transactions to display
        const entriesToShow = showingAllTransactions ? allEntries : allEntries.slice(0, transactionsPerPage);

        // Add entries to the table
        entriesToShow.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.type}</td>
                <td>${entry.time}</td>
                <td>${entry.date}</td>
                <td>${entry.amount}</td>
                <td>${entry.details || entry.status || entry.bankName || ''}</td>
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
        const fullDate = now.toISOString();

        transactions.push({ type, time, date, amount, details, fullDate });
        localStorage.setItem('transactions', JSON.stringify(transactions));

        updateTransactionTable();
    }

    // Function to get withdrawal history
    function getWithdrawalHistory() {
        const userPhoneNumber = localStorage.getItem('phoneNumber');
        const currentUser = localStorage.getItem('username');
        const currentPassword = localStorage.getItem('password');
        const withdrawalHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`;
        const withdrawalHistory = JSON.parse(localStorage.getItem(withdrawalHistoryKey)) || [];

        return withdrawalHistory.map(record => ({
            type: 'Withdrawal',
            time: record.time,
            date: record.date,
            amount: record.amount,
            details: record.status,
            fullDate: new Date(`${record.date} ${record.time}`).toISOString()
        }));
    }

    // Function to get deposit history
    function getDepositHistory() {
        const userPhoneNumber = localStorage.getItem('phoneNumber');
        const currentUser = localStorage.getItem('username');
        const currentPassword = localStorage.getItem('password');
        const depositHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_depositHistory`;
        const depositHistory = JSON.parse(localStorage.getItem(depositHistoryKey)) || [];

        return depositHistory.map(record => ({
            type: 'Deposit',
            time: record.time,
            date: record.date,
            amount: record.amount,
            details: `Bank: ${record.bankName}, Account: ${record.accountNumber}`,
            fullDate: new Date(`${record.date} ${record.time}`).toISOString()
        }));
    }

    // Add event listener to the "View More" button
    document.getElementById('viewMoreButton').addEventListener('click', function() {
        showingAllTransactions = !showingAllTransactions;
        updateTransactionTable();
    });

    // Initial call to update the table on page load
    updateTransactionTable();

    // Expose addTransaction to global scope if needed
    window.addTransaction = addTransaction;
});