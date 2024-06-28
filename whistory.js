document.addEventListener('DOMContentLoaded', function () {
    const historyTableBody = document.querySelector('#historyTable tbody');
    const userPhoneNumber = localStorage.getItem('phoneNumber');
    const currentUser = localStorage.getItem('username');
    const currentPassword = localStorage.getItem('password');

    // Retrieve the withdrawal history from local storage
    const withdrawalHistory = JSON.parse(localStorage.getItem(`${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`)) || [];

    // Reverse the array to show the newest transactions at the top
    withdrawalHistory.reverse();

    // Populate the table with the withdrawal history
    withdrawalHistory.forEach(record => {
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
        
        const statusCell = document.createElement('td');
        statusCell.textContent = record.status;
        row.appendChild(statusCell);
        
        const transactionIdCell = document.createElement('td');
        transactionIdCell.textContent = record.transactionId;
        row.appendChild(transactionIdCell);

        historyTableBody.appendChild(row);
    });
});