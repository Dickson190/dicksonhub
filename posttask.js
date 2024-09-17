document.addEventListener("DOMContentLoaded", function () {
    const postTaskBtn = document.getElementById("postTaskBtn");
    const paymentModal = document.getElementById("paymentModal");
    const closeModal = document.querySelector(".close");
    const payWithDeposit = document.getElementById("payWithDeposit");
    const payWithEarnings = document.getElementById("payWithEarnings");
    const notification = document.getElementById("notification");
    const loader = document.getElementById("loader");

    // Fill in current date using local system time
    const currentDate = new Date().toLocaleDateString();
    document.getElementById("date").value = currentDate;

    // Generate Task ID and save in localStorage
    const taskIdField = document.getElementById("taskId");
    const taskId = generateTaskId();
    taskIdField.value = taskId;
    saveTaskId(taskId);

    // Calculate reward balance on input change
    document.getElementById("reward").addEventListener("input", updateRewardBalance);
    document.getElementById("clicks").addEventListener("input", updateRewardBalance);

    function updateRewardBalance() {
        const reward = parseFloat(document.getElementById("reward").value) || 0;
        const clicks = parseInt(document.getElementById("clicks").value) || 0;
        const rewardBalance = reward * clicks;
        document.getElementById("rewardBalance").value = rewardBalance.toFixed(2);
    }

    // Handle post task button click
    postTaskBtn.addEventListener("click", function () {
        const taskData = gatherTaskData();
        if (!taskData) return;

        // Show payment modal
        paymentModal.style.display = "block";
    });

    // Close modal
    closeModal.addEventListener("click", function () {
        paymentModal.style.display = "none";
    });

    // Payment methods
    payWithDeposit.addEventListener("click", function () {
        processPayment("deposit");
    });

    payWithEarnings.addEventListener("click", function () {
        processPayment("earnings");
    });

    function gatherTaskData() {
    const taskId = document.getElementById("taskId").value;  // Use the already generated taskId
    const taskTitle = document.getElementById("taskTitle").value;
    const instructions = document.getElementById("instructions").value;
    const proofInstructions = document.getElementById("proofInstructions").value;
    const category = document.getElementById("category").value;
    const reward = parseFloat(document.getElementById("reward").value);
    const clicks = parseInt(document.getElementById("clicks").value);
    const rewardBalance = parseFloat(document.getElementById("rewardBalance").value);
    const date = document.getElementById("date").value;

    const linkProof = document.getElementById("linkProof").checked ? true : false;
    const imageProof = document.getElementById("imageProof").checked ? true : false;
    const textProof = document.getElementById("textProof").checked ? true : false;

    if (!taskTitle || !instructions || !proofInstructions || !reward || !clicks) {
        showNotification("Please fill in all required fields.", "error");
        return null;
    }

    return {
        taskId,  // Reuse the existing taskId
        taskTitle,
        instructions,
        proofInstructions,
        category,
        reward,
        clicks,
        rewardBalance,
        date,
        linkProof,
        imageProof,
        textProof
    };
}

    function generateTaskId() {
        const currentUser = localStorage.getItem('username');
        const encodedUsername = btoa(currentUser); // Convert username to base64
        const timestamp = new Date().getTime();
        return `${encodedUsername}_${timestamp}`;
    }

    function saveTaskId(taskId) {
        // Retrieve existing task IDs from localStorage or initialize an empty array
        const taskIds = JSON.parse(localStorage.getItem("taskIds")) || [];
        taskIds.push(taskId); // Add new task ID to the array

        // Save the updated task IDs array back to localStorage
        localStorage.setItem("taskIds", JSON.stringify(taskIds));
    }

    function processPayment(method) {
        const taskData = gatherTaskData();
        const currentUser = localStorage.getItem('username');
        const phoneNumber = localStorage.getItem('phoneNumber');
        const password = localStorage.getItem('password');
        let userEarnings = parseFloat(localStorage.getItem(`${phoneNumber}_${currentUser}_${password}_earnings`)) || 0;
        let userDeposit = parseFloat(localStorage.getItem(`${phoneNumber}_${currentUser}_${password}_deposit`)) || 0;

        const totalReward = taskData.rewardBalance;

        if (method === "deposit" && userDeposit >= totalReward) {
            userDeposit -= totalReward;
            localStorage.setItem(`${phoneNumber}_${currentUser}_${password}_deposit`, userDeposit);
            showNotification("Payment successful using Deposit.");
        } else if (method === "earnings" && userEarnings >= totalReward) {
            userEarnings -= totalReward;
            localStorage.setItem(`${phoneNumber}_${currentUser}_${password}_earnings`, userEarnings);
            showNotification("Payment successful using Earnings.");
        } else {
            showNotification("Insufficient funds for the selected payment method.", "error");
            return;
        }

        // Show loader before posting to the API
        showLoader();

        // Send task data to the API
        postTaskToAPI(taskData);
        paymentModal.style.display = "none";
    }

    function postTaskToAPI(taskData) {
        fetch("https://sheetdb.io/api/v1/zucejzp83yddh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(data => {
            hideLoader();
            showNotification("Task successfully posted.", "success");
            console.log("Task successfully posted:", data);

            // Redirect to task.html after 3 seconds
            setTimeout(function () {
                window.location.href = "task.html";
            }, 2000);
        })
        .catch(error => {
            hideLoader();
            showNotification("Error posting task. Please try again.", "error");
            console.error("Error posting task:", error);
        });
    }

    function showNotification(message, type = "success") {
        notification.style.display = "block";
        notification.textContent = message;
        notification.className = type === "error" ? "notification-error" : "notification-success";
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }

    function showLoader() {
        loader.style.display = "block";
    }

    function hideLoader() {
        loader.style.display = "none";
    }
});