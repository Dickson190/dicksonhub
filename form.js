document.addEventListener("DOMContentLoaded", function() {
    var today = new Date().toISOString().split('T')[0];
    var nextParticipationDate = new Date('2024-06-17').toISOString().split('T')[0];
    var hasParticipated = localStorage.getItem("hasParticipat");
    var participationDate = localStorage.getItem("participationDat");
    var userAllowed = !hasParticipated || (hasParticipated && participationDate && participationDate < nextParticipationDate && today >= nextParticipationDate);

    if (!userAllowed) {
        alert("You have already participated in the quiz today or the appointed date has not been reached. Please wait for the next time.");
        window.location.href = "premium.html";
        return;
    }

    function populateField(fieldId, localStorageKey) {
        var userProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (userProfile && userProfile[fieldId]) {
            document.getElementById(fieldId).value = userProfile[fieldId];
        } else {
            document.getElementById(fieldId).value = localStorage.getItem(localStorageKey) || "";
        }
    }

    populateField("code", "uniqueCode");
    populateField("name", "username");
    populateField("phone", "phoneNumber");
    populateField("email", "email");
    populateField("password", "password");
    populateField("network", "network");

    var questions = [
        {
            question: "What is the capital of France?",
            options: ["Paris", "London", "Berlin", "NONE"]
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Mars", "Venus", "Jupiter", "NONE"]
        },
        // ... more questions
    ];

    var questionsContainer = document.getElementById("questionsContainer");

    questions.forEach((questionObj, index) => {
        var questionDiv = document.createElement("div");
        questionDiv.className = "question";
        questionDiv.innerHTML = `<h3>Question ${index + 1}: ${questionObj.question}</h3>`;
        
        questionObj.options.forEach(option => {
            var label = document.createElement("label");
            var input = document.createElement("input");
            input.type = "radio";
            input.name = `question${index + 1}`;
            input.value = option;
            input.addEventListener("change", function(event) {
                handleOptionChange(event, index + 1);
            });
            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            questionDiv.appendChild(label);
        });

        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.id = `answer${index + 1}`;
        hiddenInput.name = `answer${index + 1}`;
        questionDiv.appendChild(hiddenInput);

        questionsContainer.appendChild(questionDiv);
    });

    function handleOptionChange(event, questionNumber) {
        var inputField = document.getElementById(`answer${questionNumber}`);
        inputField.value = event.target.value;
    }

    var timerElement = document.getElementById("timer");
    var timeLeft = 45;

    function updateTimer() {
        timerElement.textContent = `Time Left: ${timeLeft} seconds`;
        if (timeLeft > 0) {
            timeLeft--;
            if (timeLeft === 3) {
                document.querySelectorAll(".question").forEach(function(questionDiv) {
                    var questionNumber = questionDiv.querySelector("input[type=hidden]").id.replace("answer", "");
                    var options = questionDiv.querySelectorAll("input[type=radio]");
                    var answered = Array.from(options).some(option => option.checked);
                    if (!answered) {
                        var hiddenInput = document.getElementById(`answer${questionNumber}`);
                        hiddenInput.value = "NONE";
                    }
                });
            }
        } else {
            document.getElementById("quizForm").submit();
        }
    }

    setInterval(updateTimer, 1000);

    var quizForm = document.getElementById("quizForm");
    quizForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var formData = new FormData(quizForm);
        var totalScore = 0;

        questions.forEach((question, index) => {
            var userAnswer = formData.get(`answer${index + 1}`);
            if (userAnswer === "NONE") return;

            var correctAnswer = question.options[0]; // Assuming the first option is the correct answer
            if (userAnswer === correctAnswer) {
                totalScore += 1;
            }
        });

        formData.append("score", totalScore * (100 / questions.length));
        formData.append("username", document.getElementById("name").value);
        formData.append("phoneNumber", document.getElementById("phone").value);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://sheetdb.io/api/v1/g365f08c476j3", true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                localStorage.setItem("hasParticipat", true);
                localStorage.setItem("participationDat", today);
                window.location.href = "https://dickson190.github.io/dicksonhub/premium.html";
            } else {
                alert("There was an error submitting your quiz. Please try again.");
            }
        };
        xhr.onerror = function () {
            alert("There was an error submitting your quiz. Please try again.");
        };
        xhr.send(formData);
    });
});