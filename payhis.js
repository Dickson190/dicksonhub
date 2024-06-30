document.addEventListener('DOMContentLoaded', function () {
    const historyTableBody = document.querySelector('#historyTable tbody');
    const userPhoneNumber = localStorage.getItem('phoneNumber');
    const currentUser = localStorage.getItem('username');
    const currentPassword = localStorage.getItem('password');

    if (!userPhoneNumber || !currentUser || !currentPassword) {
        console.error('Missing user authentication data.');
        return;
    }

    // Retrieve the deposit history from local storage
    const depositHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_depositHistory`;
    const depositHistory = JSON.parse(localStorage.getItem(depositHistoryKey)) || [];

    // Populate the table with the deposit history
    depositHistory.forEach(record => {
        const row = document.createElement('tr');
        
        const timeCell = document.createElement('td');
        timeCell.textContent = record.time;
        row.appendChild(timeCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = record.date;
        row.appendChild(dateCell);
        
        const amountCell = document.createElement('td');
        amountCell.textContent = record.amount;
        row.appendChild(amountCell);
        
        const bankNameCell = document.createElement('td');
        bankNameCell.textContent = record.bankName;
        row.appendChild(bankNameCell);
        
        const accountNumberCell = document.createElement('td');
        accountNumberCell.textContent = record.accountNumber;
        row.appendChild(accountNumberCell);

        historyTableBody.appendChild(row);
    });
});