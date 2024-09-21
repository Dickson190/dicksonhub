document.addEventListener('DOMContentLoaded', function () {
    const historyTableBody = document.querySelector('#historyTable tbody');
    const userPhoneNumber = localStorage.getItem('phoneNumber');
    const currentUser = localStorage.getItem('username');
    const currentPassword = localStorage.getItem('password');

    // Retrieve the withdrawal history from local storage
    const withdrawalHistoryKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_withdrawalHistory`;
    let withdrawalHistory = JSON.parse(localStorage.getItem(withdrawalHistoryKey)) || [];

    // Reverse the array to show the newest transactions at the top
    withdrawalHistory.reverse();

    // Function to fetch the status from the API
    function fetchStatusFromAPI(transactionId) {
        return fetch(`https://sheetdb.io/api/v1/wjwgv7t6ub8mq/search?transactionId=${transactionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0 && data[0].status) {
                    return data[0].status.toUpperCase(); // Ensure it's in uppercase
                }
                return "PENDING"; // Default to PENDING if status is not found
            })
            .catch(error => {
                console.error('Error fetching status:', error);
                return "PENDING"; // In case of an API error, default to PENDING
            });
    }

    // Function to update status in local storage
    function updateStatusInLocalStorage(transactionId, newStatus) {
        let updated = false;

        // Update the status of the matching transaction in local storage
        withdrawalHistory = withdrawalHistory.map(record => {
            if (record.transactionId === transactionId && record.status !== newStatus) {
                record.status = newStatus;
                updated = true;
            }
            return record;
        });

        // Save the updated history back to local storage
        if (updated) {
            localStorage.setItem(withdrawalHistoryKey, JSON.stringify(withdrawalHistory.reverse())); // Reverse again to maintain original order
        }
    }

    // Populate the table with the withdrawal history and fetch updated status from the API
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
        statusCell.textContent = record.status; // Default status is from localStorage
        row.appendChild(statusCell);
        
        const transactionIdCell = document.createElement('td');
        transactionIdCell.textContent = record.transactionId;
        row.appendChild(transactionIdCell);

        // Append the row to the table first, then fetch and update the status
        historyTableBody.appendChild(row);

        // Fetch the status from the API and update the status cell
        fetchStatusFromAPI(record.transactionId).then(apiStatus => {
            statusCell.textContent = apiStatus; // Update the status to the one fetched from the API

            // If the status is "COMPLETED", update it in local storage
            if (apiStatus === 'COMPLETED') {
                updateStatusInLocalStorage(record.transactionId, apiStatus);
            }
        });
    });
});
