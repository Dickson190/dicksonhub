 const apiUrl = 'https://sheetdb.io/api/v1/qw932qls70g5c';
const username = localStorage.getItem('username');
const apiKeys = [
    'editCount', 'airtimeData', 'dataConversionData', 'withdrawalsData', 
    'taskData', 'depositData'
];

// Show notification on the page
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = type;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Store the date of the last request in localStorage
function storeLastRequestDate() {
    localStorage.setItem('lastRequestDate', new Date().toISOString());
}

// Extract localStorage data for sending to the API
function getLocalStorageData() {
    const excludedKeys = [
        'age', 'network', 'lga', 'bankName', 'state', 'phoneNumber', 
        'uniqueCode', 'userProfile', 'gender', 'lastName', 'accountName', 
        'password', 'email', 'firstName', 'others', 'dataFetched'
    ];

    let dataToSend = {};
    let undefinedData = [];

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        if (apiKeys.includes(key)) {
            dataToSend[key] = value;
        } else if (!excludedKeys.includes(key) && key !== 'username') {
            undefinedData.push(`(${key} = ${value})`);
        }
    }

    dataToSend['undefinedData'] = undefinedData.join(', ');
    return dataToSend;
}

// Handle GET request to retrieve data from the API
function sendGetRequest() {
    fetch(`${apiUrl}/search?username=${username}`)
        .then(response => response.json())
        .then(existingData => {
            if (existingData.length > 0) {
                console.log(`Username found in API: ${username}`);
                console.log('GET request successful, data retrieved and added to local storage');

                // Store the API keys' data in localStorage separately according to keys
                Object.keys(existingData[0]).forEach(key => {
                    if (apiKeys.includes(key)) {
                        localStorage.setItem(key, existingData[0][key]);
                    }
                });

                // Handle undefinedData by splitting and storing correctly in localStorage
                if (existingData[0].undefinedData) {
                    let undefinedItems = existingData[0].undefinedData.match(/\(([^)]+)\)/g);
                    if (undefinedItems) {
                        undefinedItems.forEach(item => {
                            let [key, value] = item.slice(1, -1).split(' = ');
                            if (key && value) {
                                localStorage.setItem(key, value);
                            } else {
                                console.error('Data not split properly in undefinedData:', item);
                            }
                        });
                        console.log('undefinedData retrieved and added to local storage properly');
                    } else {
                        console.error('Data not retrieved from undefinedData properly.');
                    }
                }

                storeLastRequestDate();
                sendPatchRequest(); // Trigger PATCH request after successful GET request
            } else {
                console.log('Username not found in API, proceeding with POST request.');
                sendPostRequest();
            }
        })
        .catch(error => {
            console.error('GET request Error:', error);
            showNotification(`Error during GET request: ${error.message}`, 'error');
        });
}

// Handle POST request to send data to the API
function sendPostRequest() {
    const dataToSend = getLocalStorageData();
    dataToSend['username'] = username;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataToSend }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(`POST request successful by username: ${username}`);
        showNotification('Nice to have you here', 'success');
        storeLastRequestDate();
    })
    .catch(error => {
        console.error('POST request Error:', error);
        showNotification(`Error during POST request: ${error.message}`, 'error');
    });
}

// Handle PATCH request to update data in the API
function sendPatchRequest() {
    const dataToSend = getLocalStorageData();
    dataToSend['username'] = username;

    fetch(`${apiUrl}/username/${username}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataToSend }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(`PATCH request successful by username: ${username}`);
        showNotification('Welcome Back! Please refresh this page ', 'success');
        storeLastRequestDate();
    })
    .catch(error => {
        console.error('PATCH request Error:', error);
        showNotification(`Error during PATCH request: ${error.message}`, 'error');
    });
}

// Handle automatic requests based on the last request date
function handleRequests() {
    if (username) {
        console.log(`Username found in local storage: ${username}`);
        const lastRequestDate = new Date(localStorage.getItem('lastRequestDate'));
        const currentDate = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        // First-time visit or first day of every week
        if (!lastRequestDate || currentDate - lastRequestDate >= 7 * oneDayInMs) {
            sendGetRequest();
        }

        // Two days after the first visit
        if (currentDate - lastRequestDate >= 2 * oneDayInMs && currentDate - lastRequestDate < 3 * oneDayInMs) {
            sendPatchRequest();
        }

        // Two days after the second trigger (four days in total)
        if (currentDate - lastRequestDate >= 4 * oneDayInMs && currentDate - lastRequestDate < 5 * oneDayInMs) {
            sendPatchRequest();
        }

        console.log(`Last request date: ${localStorage.getItem('lastRequestDate')}`);
    } else {
        console.warn('Username not found in local storage.');
        showNotification('Username is required!', 'error');
    }
}

// Trigger the request handling when the page loads
document.addEventListener('DOMContentLoaded', handleRequests);
