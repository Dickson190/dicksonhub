document.addEventListener('DOMContentLoaded', function() {
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

        // Parse date and time
        let fullDate = null;
        try {
            if (record.date && record.time) {
                // Check if time includes both date and time
                if (record.time.includes(',')) {
                    // Split by comma to separate date and time
                    const [datePart, timePart] = record.time.split(',');
                    fullDate = new Date(`${record.date.trim()} ${timePart.trim()}`);
                } else {
                    // Otherwise, assume time is just the time part
                    fullDate = new Date(`${record.date.trim()} ${record.time.trim()}`);
                }

                if (isNaN(fullDate)) {
                    throw new Error('Invalid date or time format');
                }
            } else {
                throw new Error('Missing date or time information');
            }
        } catch (error) {
            console.error(`Error parsing deposit record: ${JSON.stringify(record)} - ${error.message}`);
            fullDate = new Date(); // Fallback to current date/time
        }

        // Create table cells for each record
        const timeCell = document.createElement('td');
        timeCell.textContent = record.time || '-';
        row.appendChild(timeCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = record.date || '-';
        row.appendChild(dateCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = record.amount || '-';
        row.appendChild(amountCell);

        const bankNameCell = document.createElement('td');
        bankNameCell.textContent = record.bankName || '-';
        row.appendChild(bankNameCell);

        const accountNumberCell = document.createElement('td');
        accountNumberCell.textContent = record.accountNumber || '-';
        row.appendChild(accountNumberCell);

        const imageUrlCell = document.createElement('td');
        if (record.imageUrl) {
            const imageLink = document.createElement('a');
            imageLink.href = record.imageUrl;
            imageLink.textContent = 'Receipt';
            imageLink.target = '_blank';
            imageUrlCell.appendChild(imageLink);
        } else {
            imageUrlCell.textContent = '-';
        }
        row.appendChild(imageUrlCell);

        // Append the row to the table body
        historyTableBody.appendChild(row);
    });
});