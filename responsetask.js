document.addEventListener('DOMContentLoaded', () => {
    const responsesContainer = document.getElementById('responses-container');
    const notificationBox = document.getElementById('notification-box');
    const rejectReasonContainer = document.getElementById('reject-reason-container');
    const submitRejectReasonButton = document.getElementById('submit-reject-reason');
    const rejectReasonTextarea = document.getElementById('reject-reason');

    // Show styled notification
    function showNotification(message, type) {
        notificationBox.textContent = message;
        notificationBox.className = `notification-box ${type}`;
        notificationBox.style.display = 'block';
        setTimeout(() => notificationBox.style.display = 'none', 3000);
    }

    // Fetch responses from the API according to taskIds from local storage
    async function fetchResponses() {
        let taskIdsString = localStorage.getItem('taskIds');
        if (!taskIdsString) return;

        let taskIds = JSON.parse(taskIdsString);  // Parse it correctly as an array
        console.log('Retrieved taskIds from local storage:', taskIds);

        responsesContainer.innerHTML = '';

        for (const taskId of taskIds) {
            const cleanTaskId = taskId.trim(); // Trim any spaces
            console.log(`Fetching data for taskId: ${cleanTaskId}`);

            try {
                const response = await fetch(`https://sheetdb.io/api/v1/mub36dty8nox9/search?taskId=${cleanTaskId}`);
                const data = await response.json();

                if (data.length > 0) {
                    const task = data[0];  // Take the first result since API returns an array

                    console.log(`Matched taskId: ${task.taskId}`);

                    const responseDiv = document.createElement('div');
                    responseDiv.classList.add('task-response');
                    responseDiv.innerHTML = `
                        <h3>Task Title: ${task.taskTitle}</h3>
                        <p><strong>Task ID:</strong> ${task.taskId}</p>
                        <p><strong>Instructions:</strong> ${task.instructions}</p>
                        <p><strong>Proof Instructions:</strong> ${task.proofInstructions}</p>
                        <p><strong>Category:</strong> ${task.category || 'N/A'}</p>
                        <p><strong>Reward:</strong> ${task.reward}</p>
                        <p><strong>Rewardee:</strong> ${task.rewardee || 'N/A'}</p>
                        ${task.imageProof ? `<img src="${task.imageProof}" alt="Proof Image">` : ''}
                        <button class="approve-button" data-taskid="${task.taskId}" data-reward="${task.reward}" data-rewardee="${task.rewardee}">Approve</button>
                        <button class="reject-button" data-taskid="${task.taskId}">Reject</button>
                    `;
                    responsesContainer.appendChild(responseDiv);
                    console.log(`Response displayed for taskId: ${task.taskId}`);
                } else {
                    console.log(`No task found for taskId: ${cleanTaskId}`);
                }
            } catch (error) {
                console.error(`Error fetching data for taskId: ${cleanTaskId}`, error);
            }
        }
    }

    // Handle task approval
    async function handleApprove(taskId, reward, rewardee) {
        console.log(`Processing approval for taskId: ${taskId}`);

        try {
            // Fetch current clicks and rewardBalance
            const response = await fetch('https://sheetdb.io/api/v1/zucejzp83yddh');
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error fetching data from API: ${errorText}`);
                showNotification('Failed to fetch data for clicks and reward balance. Try again later.', 'error');
                return;
            }

            const data = await response.json();
            const item = data.find(item => item.taskId === taskId); // Ensure the correct column name
            if (!item) {
                console.error(`No data found for taskId: ${taskId}`);
                showNotification('Data for task not found. Cannot process approval.', 'error');
                return;
            }

            const clicks = item.clicks;
            const rewardBalance = item.rewardBalance;

            console.log(`Current clicks: ${clicks}`);
            console.log(`Current reward balance: ${rewardBalance}`);

            // Update clicks
            const updatedClicks = clicks - 1;
            const encodedTaskId = encodeURIComponent(taskId);

            let updateResponse = await fetch(`https://sheetdb.io/api/v1/zucejzp83yddh/taskId/${encodedTaskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clicks: updatedClicks })
            });

            const updateResult = await updateResponse.json();
            if (!updateResponse.ok || updateResult.error) {
                console.error(`Failed to update clicks: ${updateResult.error || 'Unknown error'}`);
                showNotification('Failed to update clicks. Try again later.', 'error');
                return;
            }

            console.log(`Clicks updated for taskId: ${taskId}. Result: ${JSON.stringify(updateResult)}`);

            // Update rewardBalance
            const updatedRewardBalance = rewardBalance - reward;

            updateResponse = await fetch(`https://sheetdb.io/api/v1/zucejzp83yddh/taskId/${encodedTaskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rewardBalance: updatedRewardBalance })
            });

            const rewardResult = await updateResponse.json();
            if (!updateResponse.ok || rewardResult.error) {
                console.error(`Failed to update reward balance: ${rewardResult.error || 'Unknown error'}`);
                showNotification('Failed to update reward balance. Try again later.', 'error');
                return;
            }

            console.log(`Reward balance updated for taskId: ${taskId}. Result: ${JSON.stringify(rewardResult)}`);

            // Send approval data (rewardee, status, reward) to the API
            const approvalData = {
                rewardee: rewardee,
                status: 'APPROVED',
                reward: reward
            };

            let approvalResponse = await fetch('https://sheetdb.io/api/v1/7reaj98gb1mys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(approvalData)
            });

            const approvalResult = await approvalResponse.json();
            if (!approvalResponse.ok || approvalResult.error) {
                console.error(`Failed to send approval data: ${approvalResult.error || 'Unknown error'}`);
                showNotification('Failed to approve task. Try again later.', 'error');
                return;
            }

            console.log(`Approval data sent for taskId: ${taskId}. Result: ${JSON.stringify(approvalResult)}`);

            // Delete approved task from the API
            await fetch(`https://sheetdb.io/api/v1/mub36dty8nox9/taskId/${taskId}`, { method: 'DELETE' });
            console.log(`Deleted approved taskId from API: ${taskId}`);

            // Remove taskId from local storage
            let taskIds = JSON.parse(localStorage.getItem('taskIds')) || [];
            taskIds = taskIds.filter(id => id !== taskId);
            localStorage.setItem('taskIds', JSON.stringify(taskIds));
            console.log(`Removed taskId: ${taskId} from local storage`);

            showNotification('Task approved successfully!', 'success');
            fetchResponses();
        } catch (error) {
            console.error(`Error during approval process for taskId: ${taskId}`, error);
            showNotification('Failed to approve task. Try again later.', 'error');
        }
    }

    // Handle task rejection
    async function handleReject(taskId, reason) {
        console.log(`Processing rejection for taskId: ${taskId}`);

        try {
            // Send rejection reason and update status
            await fetch('https://sheetdb.io/api/v1/7reaj98gb1mys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: reason, status: 'DISAPPROVED' })
            });
            console.log('Rejection reason sent. Status updated to DISAPPROVED.');

            // Delete rejected task from the API
            await fetch(`https://sheetdb.io/api/v1/mub36dty8nox9/taskId/${taskId}`, { method: 'DELETE' });
            console.log(`Deleted rejected taskId from API: ${taskId}`);

            // Remove taskId from local storage
            let taskIds = JSON.parse(localStorage.getItem('taskIds')) || [];
            taskIds = taskIds.filter(id => id !== taskId);
            localStorage.setItem('taskIds', JSON.stringify(taskIds));
            console.log(`Removed taskId: ${taskId} from local storage`);

            showNotification('Task rejected successfully!', 'error');
            fetchResponses();
        } catch (error) {
            console.error(`Error during rejection process for taskId: ${taskId}`, error);
            showNotification('Failed to reject task. Try again later.', 'error');
        }
    }

    // Event delegation for approve and reject buttons
    responsesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('approve-button')) {
            const taskId = e.target.getAttribute('data-taskid');
            const reward = parseInt(e.target.getAttribute('data-reward'), 10);
                        const rewardee = e.target.getAttribute('data-rewardee');
            handleApprove(taskId, reward, rewardee);
        } else if (e.target.classList.contains('reject-button')) {
            const taskId = e.target.getAttribute('data-taskid');
            rejectReasonContainer.style.display = 'block';
            submitRejectReasonButton.onclick = () => {
                const reason = rejectReasonTextarea.value;
                rejectReasonContainer.style.display = 'none';
                handleReject(taskId, reason);
            };
        }
    });

    fetchResponses(); // Initial call to load responses
});
