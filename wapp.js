document.addEventListener('DOMContentLoaded', function() {
    const transactionsPerPage = 5;
    let showingAllTransactions = false;

    // Function to retrieve "COMPLETED" status from local storage for a specific transaction
    function getStatusFromLocalStorage(transactionId) {
        const userPhoneNumber = localStorage.getItem('phoneNumber');
        const currentUser = localStorage.getItem('username');
        const currentPassword = localStorage.getItem('password');
        const withdrawalHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`;
        const withdrawalHistory = JSON.parse(localStorage.getItem(withdrawalHistoryKey)) || [];

        const matchingRecord = withdrawalHistory.find(record => record.transactionId === transactionId);

        if (matchingRecord) {
            return matchingRecord.status || "PENDING";  // Return the status, default to PENDING if not found
        }
        return "PENDING";  // Default to PENDING if no match is found
    }

    // Function to update the transaction table
    function updateTransactionTable() {
        const transactionTable = document.getElementById('transactionTableBody');
        transactionTable.innerHTML = ''; // Clear existing rows

        // Retrieve transactions, withdrawals, deposits, and claim rewards from local storage
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const withdrawals = getWithdrawalHistory();
        const deposits = getDepositHistory();
        const claims = getClaimTransactions(); // Retrieve click claim transactions

        // Combine all entries and sort by the most recent date and time
        const allEntries = [...transactions, ...withdrawals, ...deposits, ...claims].filter(entry => entry.fullDate).sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));

        // Determine the transactions to display
        const entriesToShow = showingAllTransactions ? allEntries : allEntries.slice(0, transactionsPerPage);

        // Add entries to the table
        entriesToShow.forEach(entry => {
            const row = document.createElement('tr');
            let statusDetails = entry.details || 'CREDITED';

            // Update the details if it's a withdrawal with a "COMPLETED" status
            if (entry.type === 'Withdrawal') {
                const storedStatus = getStatusFromLocalStorage(entry.transactionId);
                statusDetails = storedStatus === 'COMPLETED' ? 'COMPLETED' : statusDetails;
            }

            row.innerHTML = `
                <td>${entry.type}</td>
                <td>${entry.time}</td>
                <td>${entry.date}</td>
                <td>${entry.amount}</td>
                <td>${statusDetails}</td>
            `;
            transactionTable.appendChild(row);
        });
    }

    // Function to add a transaction (used for all transaction types)
    function addTransaction(type, amount, details = 'CREDITED') {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();
        const fullDate = now.toISOString();

        transactions.push({ type, time, date, amount, details, fullDate });
        localStorage.setItem('transactions', JSON.stringify(transactions));

        updateTransactionTable();
    }

    // Function to retrieve withdrawal history
    function getWithdrawalHistory() {
        const userPhoneNumber = localStorage.getItem('phoneNumber');
        const currentUser = localStorage.getItem('username');
        const currentPassword = localStorage.getItem('password');
        const withdrawalHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`;
        const withdrawalHistory = JSON.parse(localStorage.getItem(withdrawalHistoryKey)) || [];

        return withdrawalHistory.map(record => {
            let fullDate = null;
            try {
                if (record.date && record.time) {
                    fullDate = new Date(`${record.date}, ${record.time}`);
                    if (isNaN(fullDate)) {
                        fullDate = new Date(`${record.date} ${record.time}`);
                    }
                    if (isNaN(fullDate)) {
                        throw new Error('Invalid date or time format');
                    }
                } else {
                    throw new Error('Missing date or time information');
                }
            } catch (error) {
                console.error(`Error parsing withdrawal record: ${JSON.stringify(record)} - ${error.message}`);
                fullDate = new Date();
            }

            return {
                type: 'Withdrawal',
                time: record.time || '-',
                date: record.date || '-',
                amount: record.amount || '-',
                details: getStatusFromLocalStorage(record.transactionId),  // Fetch and display correct status
                fullDate: fullDate.toISOString(),
                transactionId: record.transactionId // Include transaction ID for status tracking
            };
        });
    }

    // Function to retrieve deposit history
    function getDepositHistory() {
        const userPhoneNumber = localStorage.getItem('phoneNumber');
        const currentUser = localStorage.getItem('username');
        const currentPassword = localStorage.getItem('password');
        const depositHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_depositHistory`;
        const depositHistory = JSON.parse(localStorage.getItem(depositHistoryKey)) || [];

        return depositHistory.map(record => {
            let fullDate = null;
            try {
                if (record.date && record.time) {
                    fullDate = new Date(`${record.date}, ${record.time}`);
                    if (isNaN(fullDate)) {
                        fullDate = new Date(`${record.date} ${record.time}`);
                    }
                    if (isNaN(fullDate)) {
                        throw new Error('Invalid date or time format');
                    }
                } else {
                    throw new Error('Missing date or time information');
                }
            } catch (error) {
                console.error(`Error parsing deposit record: ${JSON.stringify(record)} - ${error.message}`);
                fullDate = new Date();
            }

            return {
                type: 'Deposit',
                time: record.time || '-',
                date: record.date || '-',
                amount: record.amount || '-',
                details: `Bank: ${record.bankName || '-'}, Account: ${record.accountNumber || '-'}`,
                fullDate: fullDate.toISOString()
            };
        });
    }

    // Function to retrieve click claim transactions from local storage
    function getClaimTransactions() {
        const userPhoneNumber = localStorage.getItem('phoneNumber');
        const currentUser = localStorage.getItem('username');
        const currentPassword = localStorage.getItem('password');
        const claimHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_claimHistory`;
        const claimHistory = JSON.parse(localStorage.getItem(claimHistoryKey)) || [];

        return claimHistory.map(record => {
            let fullDate = null;
            try {
                if (record.date && record.time) {
                    fullDate = new Date(`${record.date}, ${record.time}`);
                    if (isNaN(fullDate)) {
                        fullDate = new Date(`${record.date} ${record.time}`);
                    }
                    if (isNaN(fullDate)) {
                        throw new Error('Invalid date or time format');
                    }
                } else {
                    throw new Error('Missing date or time information');
                }
            } catch (error) {
                console.error(`Error parsing claim record: ${JSON.stringify(record)} - ${error.message}`);
                fullDate = new Date();
            }

            return {
                type: 'Click Claim',
                time: record.time || '-',
                date: record.date || '-',
                amount: record.amount || '-',
                details: 'Reward Claimed',  // Display this for all claim transactions
                fullDate: fullDate.toISOString()
            };
        });
    }

    document.getElementById('viewMoreButton').addEventListener('click', function() {
        showingAllTransactions = !showingAllTransactions;
        updateTransactionTable();
    });

    updateTransactionTable();

    window.addTransaction = addTransaction; // Make addTransaction globally accessible
});