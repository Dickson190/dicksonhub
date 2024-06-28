document.addEventListener('DOMContentLoaded', function () {
    const userPhoneNumber = localStorage.getItem('phoneNumber');
    const currentUser = localStorage.getItem('username');
    const currentPassword = localStorage.getItem('password');

    const activeCardKey = `${userPhoneNumber}_${currentUser}_${currentPassword}_activeCard`;
    let activeCard = JSON.parse(localStorage.getItem(activeCardKey));

    function updateButtonStates() {
        const premiumButton = document.getElementById('premium-quiz');
        if (activeCard && activeCard.planName) {
            premiumButton.innerText = `${activeCard.planName}`;
            premiumButton.style.backgroundColor = '#28a745';
            premiumButton.style.cursor = 'pointer';
            premiumButton.style.pointerEvents = 'auto';
            premiumButton.onclick = function() {
                window.location.href = 'quiz.html';
            };
        } else {
            premiumButton.innerText = 'Premium Quiz';
            premiumButton.style.backgroundColor = '#007bff';
            premiumButton.style.cursor = 'not-allowed';
            premiumButton.style.pointerEvents = 'none';
            premiumButton.onclick = null;
        }
    }

    function startQuiz() {
        window.location.href = 'quiz.html';
    }

    const freeQuizButton = document.getElementById('free-quiz');
    const countdownDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
    const updateTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        freeQuizButton.querySelector('.timer').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        if (distance < 0) {
            clearInterval(updateTimer);
            freeQuizButton.querySelector('.timer').textContent = "Start Quiz";
            freeQuizButton.style.backgroundColor = '#28a745';
            freeQuizButton.onclick = startQuiz;
        }
    }, 1000);

    updateButtonStates();
    setInterval(updateButtonStates, 60000);
});