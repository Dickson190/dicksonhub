
    const currentUser = localStorage.getItem('username');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const password = localStorage.getItem('password');
    let userEarnings = parseFloat(localStorage.getItem(`${phoneNumber}_${currentUser}_${password}_earnings`)) || 0;
    const uniqueCode = localStorage.getItem('uniqueCode');

    // APIs to try in case one fails
    const apiList = [
        'https://sheetdb.io/api/v1/7reaj98gb1mys',
        'https://another-api-url.com',
        'https://yet-another-api-url.com'
    ];

    // Function to show notification
    function showNotification(message, type = 'success') {
        const notificationBox = document.getElementById('notification-box');
        notificationBox.textContent = message;
        notificationBox.className = `notification-box ${type}`;
        notificationBox.style.display = 'block';

        // Hide notification after 3 seconds
        setTimeout(() => {
            notificationBox.style.display = 'none';
        }, 3000);
    }

    // Function to check rewardee and match with uniqueCode
    async function fetchRewardee() {
        for (let api of apiList) {
            try {
                console.log(`Attempting to fetch from API: ${api}`);
                const response = await fetch(api);
                const data = await response.json();
                console.log('API data retrieved:', data);

                // Filter data to match uniqueCode in rewardee field
                const matchedRewardees = data.filter(item => item.rewardee === uniqueCode);
                console.log('Matched rewardees:', matchedRewardees);

                if (matchedRewardees.length > 0) {
                    // Store data in local storage for further use
                    localStorage.setItem('rewardeeData', JSON.stringify(matchedRewardees));
                    displayRewardeeData(matchedRewardees);
                    return; // Exit loop on successful match and display
                } else {
                    console.log('No matches found for rewardee:', uniqueCode);
                    showNotification('No task rewards available.', 'error');
                }
            } catch (error) {
                console.log(`Failed to fetch from API: ${api}, Error:`, error);
            }
        }
        console.log('All API attempts failed or no matches found.');
    }

    // Function to display matched rewardees
    function displayRewardeeData(rewardees) {
        const container = document.getElementById('rewardee-container');
        container.innerHTML = ''; // Clear previous data

        rewardees.forEach((rewardeeData, index) => {
            const { status, reward, message } = rewardeeData;

            const rewardeeDiv = document.createElement('div');
            rewardeeDiv.classList.add('rewardee');

            // Title and instructions
            rewardeeDiv.innerHTML = `
                <h2>Task Rewardee ${index + 1}</h2>
                <p>Status: ${status}</p>
                <p>Reward: ${reward}</p>
                <p>Message: ${message || 'No message provided'}</p>
            `;

            // Button logic for Approved/Accepted or Rejected/Disapproved status
            if (status === 'APPROVED' || status === 'ACCEPTED') {
                const claimButton = document.createElement('button');
                claimButton.textContent = 'CLAIM REWARD';
                claimButton.classList.add('claim-button');
                claimButton.addEventListener('click', () => claimReward(rewardeeData));
                rewardeeDiv.appendChild(claimButton);
            } else if (status === 'REJECTED' || status === 'DISAPPROVED') {
                const tryAgainButton = document.createElement('button');
                tryAgainButton.textContent = 'Try Next Time';
                tryAgainButton.classList.add('reject-button');
                tryAgainButton.addEventListener('click', () => tryNextTime(rewardeeData));
                rewardeeDiv.appendChild(tryAgainButton);

                // Automatically click "Try Again Next Time" button after 10 seconds if no click
                setTimeout(() => {
                    tryAgainButton.click();
                }, 10000);
            }

            container.appendChild(rewardeeDiv);
        });
    }

    // Function to claim reward
    function claimReward(rewardeeData) {
        const { reward } = rewardeeData;
        userEarnings += parseFloat(reward);
        localStorage.setItem(`${phoneNumber}_${currentUser}_${password}_earnings`, userEarnings);
        console.log(`Reward of ${reward} claimed. New balance: ${userEarnings}`);

        // Show success notification
        showNotification(`You completed the task, and your new balance is: ${userEarnings}`, 'success');

        // DELETE data from API using uniqueCode as record ID
        deleteRewardeeFromAPI(rewardeeData);

        // Clear local storage
        localStorage.removeItem('rewardeeData');
        console.log('Local storage data cleared after claiming reward.');

        // Refresh page after claim
        setTimeout(() => {
            location.reload(); // Refresh page after 1 second
        }, 1000);
    }

    // Function to handle "Try Again Next Time" for rejected tasks
    function tryNextTime(rewardeeData) {
        console.log('Task rejected or disapproved. Rewardee data:', rewardeeData);
        showNotification('Task rejected or disapproved. Try again next time.', 'error');

        // DELETE data from API using uniqueCode as record ID
        deleteRewardeeFromAPI(rewardeeData);
    }

    // Function to DELETE rewardee data from API
    async function deleteRewardeeFromAPI(rewardeeData) {
        const { rewardee } = rewardeeData;  // Use 'rewardee' field as unique code

        for (let api of apiList) {
            const deleteUrl = `${api}/rewardee/${rewardee}`; // Assuming /rewardee/:uniqueCode format

            // Log the delete URL for debugging
            console.log(`Attempting to delete from API: ${deleteUrl}`);

            try {
                const response = await fetch(deleteUrl, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error(`Failed to delete from ${api}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(`Successfully deleted rewardee data from API: ${api}`, data);

                // Exit the loop after successful deletion
                return;  // Stops further execution if delete is successful
            } catch (error) {
                console.log(`Error deleting rewardee data from API: ${api}`, error);
            }
        }
        console.log('All DELETE attempts failed.');
    }

    // Initiate fetching of rewardee data on page load
    document.addEventListener('DOMContentLoaded', fetchRewardee);


