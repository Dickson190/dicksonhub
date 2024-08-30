document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const greetingSection = document.getElementById('greeting');
    const currentUser = localStorage.getItem('username');

    // Helper Functions
    function updateGreeting() {
        const currentHour = new Date().getHours();
        let greeting = 'Hello';

        if (currentHour < 12) {
            greeting = 'Good morning';
        } else if (currentHour < 18) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }

        greetingSection.textContent = `${greeting}, ${currentUser}`;
    }

    // Initialize the page
    updateGreeting();
});