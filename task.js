document.addEventListener("DOMContentLoaded", function () {
    const taskContainer = document.getElementById('taskContainer');
    const taskAPIs = [
        "https://sheetdb.io/api/v1/zucejzp83yddh", // Primary Task API
        "https://alternative-api1.com/tasks",      // Alternative Task API
        "https://alternative-api2.com/tasks"       // Another alternative Task API
    ];
    const submissionAPIs = [
        "https://sheetdb.io/api/v1/mub36dty8nox9", // Primary Submission API
        "https://alternative-api1.com/submit",     // Alternative Submission API
        "https://alternative-api2.com/submit"      // Another alternative Submission API
    ];
    const imgbbAPIKey = '640c7387647d7dc87131c174da3340eb';
    const uniqueCode = localStorage.getItem('uniqueCode') || 'DEFAULT_CODE';

    // Fetch tasks from API on load, every Sunday
    const today = new Date();
    const isSunday = today.getDay() === 0;
    
    if (!localStorage.getItem('tasksFetched') || isSunday) {
        fetchTasksFromAPIs(0);
    } else {
        displayTasksFromStorage();
    }

    function fetchTasksFromAPIs(apiIndex) {
        if (apiIndex >= taskAPIs.length) {
            showNotification('All task-fetching APIs failed', 'error');
            return;
        }

        fetch(taskAPIs[apiIndex])
            .then(response => response.json())
            .then(tasks => {
                if (tasks.length > 0) {
                    localStorage.setItem('tasksFetched', JSON.stringify(tasks));
                    localStorage.setItem('completedTasks', JSON.stringify([])); // Reset completed tasks
                    tasks.forEach(task => displayTask(task));
                } else {
                    showNotification('No tasks available from API', 'error');
                }
            })
            .catch(error => {
                console.error(`Error fetching tasks from API ${apiIndex}:`, error);
                fetchTasksFromAPIs(apiIndex + 1); // Try the next API
            });
    }

    function displayTasksFromStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasksFetched'));
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        tasks.forEach(task => {
            if (!completedTasks.includes(task.taskId)) {
                displayTask(task);
            }
        });
    }

    function displayTask(task) {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.innerHTML = `
            <h3>${task.taskTitle}</h3>
            <p><strong>Task ID:</strong> ${task.taskId}</p>
            <p><strong>Instructions:</strong> ${task.instructions}</p>
            <p><strong>Proof Instructions:</strong> ${task.proofInstructions}</p>
            <p><strong>Category:</strong> ${task.category}</p>
            <p><strong>Reward:</strong> ₦${task.reward}</p>
            <p><strong>Date:</strong> ${task.date}</p>
            <button class="expand-button">View & Submit</button>

            <div class="task-details hidden">
                <form class="task-form">
                    <label>Unique Code</label>
                    <input type="text" value="${uniqueCode}" readonly>

                    ${task.linkProof ? `<label>Link Proof</label><input type="url" id="linkProof" placeholder="Enter link">` : ''}
                    ${task.imageProof ? `<label>Image Proof</label><input type="file" id="imageProof">` : ''}
                    ${task.textProof ? `<label>Text Proof</label><textarea id="textProof" placeholder="Enter text proof"></textarea>` : ''}

                    <button type="button" class="submit-btn">Submit</button>
                </form>
            </div>
        `;

        taskCard.querySelector('.expand-button').addEventListener('click', function () {
            const taskDetails = taskCard.querySelector('.task-details');
            taskDetails.classList.toggle('hidden');
            taskCard.classList.toggle('expanded');
        });

        taskCard.querySelector('.submit-btn').addEventListener('click', function () {
            handleSubmit(task, taskCard);
        });

        taskContainer.appendChild(taskCard);
    }

    function handleSubmit(task, taskCard) {
        const linkProof = task.linkProof ? taskCard.querySelector('#linkProof').value : null;
        const imageProofFile = task.imageProof ? taskCard.querySelector('#imageProof').files[0] : null;
        const textProof = task.textProof ? taskCard.querySelector('#textProof').value : null;

        if (task.linkProof && !linkProof) {
            showNotification('Please provide a valid link proof', 'error');
            return;
        }

        if (task.imageProof && !imageProofFile) {
            showNotification('Please upload an image proof', 'error');
            return;
        }

        if (task.textProof && !textProof) {
            showNotification('Please enter text proof', 'error');
            return;
        }

        let imageUrl = '';

        if (imageProofFile) {
            const formData = new FormData();
            formData.append('image', imageProofFile);

            fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    imageUrl = data.data.url;
                    submitTaskData(task, linkProof, textProof, imageUrl, 0);
                })
                .catch(error => showNotification('Error uploading image', 'error'));
        } else {
            submitTaskData(task, linkProof, textProof, imageUrl, 0);
        }
    }

    function submitTaskData(task, linkProof, textProof, imageProof, apiIndex) {
        if (apiIndex >= submissionAPIs.length) {
            showNotification('All submission APIs failed', 'error');
            return;
        }

        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        const taskData = {
            taskId: task.taskId,
            taskTitle: task.taskTitle,
            instructions: task.instructions,
            proofInstructions: task.proofInstructions,
            category: task.category,
            reward: task.reward,
            linkProof: linkProof || '',
            textProof: textProof || '',
            imageProof: imageProof || '',
            rewardee: uniqueCode,  // Correctly sending uniqueCode here
            date: currentDate // Add current date to the submission
        };

        fetch(submissionAPIs[apiIndex], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        })
            .then(response => response.json())
            .then(data => {
                markTaskAsCompleted(task.taskId);
                showNotification('Task successfully submitted!', 'success');
            })
            .catch(error => {
                console.error(`Error submitting task to API ${apiIndex}:`, error);
                submitTaskData(task, linkProof, textProof, imageProof, apiIndex + 1); // Try the next API
            });
    }

    function markTaskAsCompleted(taskId) {
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        completedTasks.push(taskId);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

        taskContainer.innerHTML = ''; // Clear current tasks
        displayTasksFromStorage(); // Display remaining tasks
    }

    // Notification system
    function showNotification(message, type) {
        const notificationBox = document.createElement('div');
        notificationBox.classList.add('notification-box', type);

        const icon = type === 'success' ? '✓' : '⚠️'; // Check mark for success, warning sign for error
        const iconClass = type === 'success' ? 'checkmark-icon' : 'warning-icon';
        notificationBox.innerHTML = `
            <span class="${iconClass}">${icon}</span>
            <span class="notification-message">${message}</span>
        `;

        document.body.appendChild(notificationBox);

        setTimeout(() => {
            notificationBox.classList.add('active');
        }, 10);

        setTimeout(() => {
            notificationBox.classList.remove('active');
            document.body.removeChild(notificationBox);
        }, 3000);
    }
});
