const apiURL = "https://sheetdb.io/api/v1/329lgfmuxz0t9";
const currentUser = localStorage.getItem('username');
const phoneNumber = localStorage.getItem('phoneNumber');
const password = localStorage.getItem('password');
let userEarnings = parseFloat(localStorage.getItem(`${phoneNumber}_${currentUser}_${password}_earnings`)) || 0;
const rewardAmount = 100;

document.addEventListener('DOMContentLoaded', function () {
    const claimButton = document.getElementById('claim-btn');
    const notificationBox = document.getElementById('notification');
    const earningsDisplay = document.getElementById('earnings-display');

    // Update the earnings display with the current earnings
    earningsDisplay.textContent = userEarnings.toFixed(2);

    // Function to display notification
    function showNotification(message) {
        notificationBox.textContent = message;
        notificationBox.classList.add('show');
    }

    // Function to hide notification
    function hideNotification() {
        notificationBox.classList.remove('show');
    }

    // Check if the user has already claimed
    const userClick = localStorage.getItem(`${currentUser}_hasClicked`);
    if (userClick) {
        claimButton.disabled = true;
        showNotification('You have already claimed your reward.');
        return;
    }

    // Fetch the available clicks from the API
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const userRow = data.find(row => row.rowId === "1");

            if (userRow && userRow.clicks) {
                let availableClicks = parseInt(userRow.clicks, 10);
                document.getElementById('available-clicks').textContent = availableClicks;

                if (availableClicks <= 0) {
                    claimButton.disabled = true;
                    showNotification('No more clicks available.');
                    return;
                }

                // Claim button click event
                claimButton.addEventListener('click', () => {
                    if (availableClicks > 0) {
                        claimButton.disabled = true;

                        // Update earnings in local storage
                        userEarnings += rewardAmount;
                        localStorage.setItem(`${phoneNumber}_${currentUser}_${password}_earnings`, userEarnings);
                        localStorage.setItem(`${currentUser}_hasClicked`, 'true');
                        earningsDisplay.textContent = userEarnings.toFixed(2);

                        // Deduct 1 click from available clicks
                        const updatedClicks = availableClicks - 1;

                        // Prepare payload for updating the API
                        const updatePayload = {
                            "clicks": updatedClicks.toString()
                        };

                        // Update clicks in the API using a PUT request
                        fetch(`${apiURL}/rowId/1`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatePayload)
                        })
                        .then(() => {
                            document.getElementById('available-clicks').textContent = updatedClicks;
                            showNotification('Reward claimed successfully! Your earnings have been updated.');

                            // Save the claim transaction to local storage
                            addTransaction('Claim', rewardAmount, 'Reward claimed for clicking.');

                            // After successful claim, notify the user and redirect
                            setTimeout(() => {
                                showNotification('Please hold on, redirecting to the homepage...');
                                setTimeout(() => {
                                    window.location.href = 'app.html';  // Redirect to app.html
                                }, 5000);
                            }, 2000);
                        })
                        .catch(error => {
                            console.error('Error updating the API:', error);
                            showNotification('Error claiming reward. Please try again.');
                            claimButton.disabled = false;
                        });
                    }
                });
            } else {
                showNotification('Error: Click data not available.');
            }
        })
        .catch(error => {
            console.error('Error fetching data from API:', error);
            showNotification('Error fetching data. Please try again.');
        });
});

// Function to add transaction to local storage
function addTransaction(type, amount, details = 'CREDITED') {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    const fullDate = now.toISOString();

    transactions.push({ type, time, date, amount, details, fullDate });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}