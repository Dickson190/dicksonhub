document.addEventListener("DOMContentLoaded", function() {
    // Get today's date
    var today = new Date().toISOString().split('T')[0];

    // Set the allowed next participation date
    var nextParticipationDate = new Date('2024-06-17').toISOString().split('T')[0];

    // Check if the user has already participated
    var hasParticipated = localStorage.getItem("hasParticipated");
    var participationDate = localStorage.getItem("participationDate");

    // Determine if the user is allowed to access the page
    var userAllowed = !hasParticipated || (hasParticipated && participationDate && participationDate < nextParticipationDate && today >= nextParticipationDate);

    if (!userAllowed) {
        alert("You have already participated in the quiz today or the appointed date has not been reached. Please wait for the next time.");
        window.location.href = "app.html";
        return;
    }

    // Function to populate fields from local storage or default values
    function populateField(fieldId, localStorageKey) {
        var userProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (userProfile && userProfile[fieldId]) {
            document.getElementById(fieldId).value = userProfile[fieldId];
        } else {
            document.getElementById(fieldId).value = localStorage.getItem(localStorageKey) || "";
        }
    }

    // Populate form fields from local storage or use default values
    populateField("code", "uniqueCode");
    populateField("name", "username");
    populateField("phone", "phoneNumber");
    populateField("email", "email");
    populateField("password", "password");  // Assuming there's a hidden password field
    populateField("network", "network"); // New: Populate network field

    // Function to handle option selection
    function handleOptionChange(event, questionNumber) {
        var inputField = document.getElementById(`answer${questionNumber}`);
        inputField.value = event.target.value;
    }

    // Add event listeners to option inputs
    document.querySelectorAll(".question input[type=radio]").forEach(function(input) {
        input.addEventListener("change", function(event) {
            var questionNumber = event.target.name.replace("question", "");
            handleOptionChange(event, questionNumber);
        });
    });

    // Timer functionality
    var timerElement = document.getElementById("timer");
    var timeLeft = 45;

    function updateTimer() {
        timerElement.textContent = `Time Left: ${timeLeft} seconds`;
        if (timeLeft > 0) {
            timeLeft--;
            if (timeLeft === 3) {
                // Populate unanswered quiz options with the last choices
                document.querySelectorAll(".question").forEach(function(questionDiv) {
                    var questionNumber = questionDiv.querySelector("input[type=hidden]").id.replace("answer", "");
                    var options = questionDiv.querySelectorAll("input[type=radio]");
                    var answered = Array.from(options).some(option => option.checked);
                    if (!answered) {
                        options[options.length - 1].checked = true;
                        handleOptionChange({ target: options[options.length - 1] }, questionNumber);
                    }
                });
            }
        } else {
            clearInterval(timerInterval);

            // Mark the user as participated
            localStorage.setItem("hasParticipated", true);
            localStorage.setItem("participationDate", today);

            // Submit the form when time is up
            document.querySelector("form").submit();
        }
    }

    updateTimer();
    var timerInterval = setInterval(updateTimer, 1000);
});