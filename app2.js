const apiUrls = [
    'https://sheetdb.io/api/v1/qw932qls70g5c', // First API
    'https://sheetdb.io/api/v1/fallbackApi2',   // Second API (fallback)
    'https://sheetdb.io/api/v1/fallbackApi3'    // Third API (fallback)
];

// Get current user and other necessary details from local storage
const currentUser = localStorage.getItem('username');
const userPhoneNumber = localStorage.getItem('phoneNumber');
const currentPassword = localStorage.getItem('password');

// Define the specific keys for detecting changes
const activeCodeKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_activeCode`;
const activeCardKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_activeCard`;
const userClaimKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_claimedCodes`;
const userEarningsKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_earnings`;
const depositKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_deposit`;

// Function to show notification
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

// Extract localStorage data for sending to the API (only the specific keys)
function getLocalStorageData() {
    let dataToSend = {};

    // Include the specific keys to send in the request
    dataToSend['activeCode'] = localStorage.getItem(activeCodeKey);
    dataToSend['activeCard'] = localStorage.getItem(activeCardKey);
    dataToSend['claimedCodes'] = localStorage.getItem(userClaimKey);
    dataToSend['earnings'] = localStorage.getItem(userEarningsKey);
    dataToSend['deposit'] = localStorage.getItem(depositKey);

    return dataToSend;
}

// Try API requests sequentially until success
function tryApiRequest(requestFunction, apiIndex = 0) {
    if (apiIndex < apiUrls.length) {
        requestFunction(apiUrls[apiIndex])
            .then(success => {
                if (!success) {
                    console.warn(`Failed with API ${apiUrls[apiIndex]}, trying next...`);
                    tryApiRequest(requestFunction, apiIndex + 1);
                }
            })
            .catch(error => {
                console.error(`Error with API ${apiUrls[apiIndex]}:`, error);
                tryApiRequest(requestFunction, apiIndex + 1);
            });
    } else {
        console.error('All APIs failed.');
        showNotification('Error: All APIs failed. Please try again later.', 'error');
    }
}

// Handle GET request to retrieve data from the API
function sendGetRequest(apiUrl) {
    return fetch(`${apiUrl}/search?username=${currentUser}`)
        .then(response => response.json())
        .then(existingData => {
            if (existingData.length > 0) {
                console.log(`Username found in API: ${currentUser}`);
                console.log('GET request successful, data retrieved and added to local storage');

                // Store specific keys' data in localStorage
                localStorage.setItem(activeCodeKey, existingData[0].activeCode || '');
                localStorage.setItem(activeCardKey, existingData[0].activeCard || '');
                localStorage.setItem(userClaimKey, existingData[0].claimedCodes || '');
                localStorage.setItem(userEarningsKey, existingData[0].earnings || '');
                localStorage.setItem(depositKey, existingData[0].deposit || '');

                storeLastRequestDate();
                sendPatchRequest(); // Trigger PATCH request after successful GET request
                return true;
            } else {
                console.log('Username not found in API, proceeding with POST request.');
                sendPostRequest();
                return true;
            }
        })
        .catch(error => {
            console.error('GET request Error:', error);
            showNotification(`Error during GET request: ${error.message}`, 'error');
            return false;
        });
}

// Handle POST request to send data to the API
function sendPostRequest() {
    const dataToSend = getLocalStorageData();
    dataToSend['username'] = currentUser;

    tryApiRequest((apiUrl) => {
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: dataToSend }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(`POST request successful by username: ${currentUser}`);
            showNotification('Nice to have you here', 'success');
            storeLastRequestDate();
            return true;
        })
        .catch(error => {
            console.error('POST request Error:', error);
            showNotification(`Error during POST request: ${error.message}`, 'error');
            return false;
        });
    });
}

// Detect specific changes in local storage and trigger PATCH request
function detectLocalStorageChanges() {
    const currentData = getLocalStorageData();
    const previousData = JSON.parse(localStorage.getItem('previousLocalStorageData') || '{}');
    
    // Compare each specific key to detect changes
    const hasChanged = (
        currentData.activeCode !== previousData.activeCode ||
        currentData.activeCard !== previousData.activeCard ||
        currentData.claimedCodes !== previousData.claimedCodes ||
        currentData.earnings !== previousData.earnings ||
        currentData.deposit !== previousData.deposit
    );

    if (hasChanged) {
        console.log('Change detected in local storage for the specific keys.');
        sendPatchRequest(); // Trigger PATCH request
    } else {
        console.log('No changes detected in specific local storage keys.');
    }
}

// Handle PATCH request to update data in the API
function sendPatchRequest() {
    const dataToSend = getLocalStorageData();
    dataToSend['username'] = currentUser;

    tryApiRequest((apiUrl) => {
        return fetch(`${apiUrl}/username/${currentUser}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: dataToSend }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(`PATCH request successful by username: ${currentUser}`);
            showNotification('Data updated successfully!', 'success');
            storeLastRequestDate();
            localStorage.setItem('previousLocalStorageData', JSON.stringify(dataToSend)); // Store the current state
            return true;
        })
        .catch(error => {
            console.error('PATCH request Error:', error);
            showNotification(`Error during PATCH request: ${error.message}`, 'error');
            return false;
        });
    });
}

// Handle automatic requests based on the last request date and detect changes
function handleRequests() {
    if (currentUser) {
        console.log(`Username found in local storage: ${currentUser}`);
        const lastRequestDate = new Date(localStorage.getItem('lastRequestDate'));
        const currentDate = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        // First-time visit or every 7 days
        if (!lastRequestDate || currentDate - lastRequestDate >= 7 * oneDayInMs) {
            tryApiRequest(sendGetRequest);
        }

        // Detect changes in local storage and trigger PATCH request if needed
        detectLocalStorageChanges();
    } else {
        console.warn('Username not found in local storage.');
        showNotification('Username is required!', 'error');
    }
}

// Trigger the request handling when the page loads
document.addEventListener('DOMContentLoaded', handleRequests);