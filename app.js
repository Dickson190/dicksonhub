document.addEventListener('DOMContentLoaded', function () {
    const currentUser = localStorage.getItem('username');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const password = localStorage.getItem('password');
    const userEarnings = parseFloat(localStorage.getItem(`${phoneNumber}_${currentUser}_${password}_earnings`)) || 0;
    const userDeposit = parseFloat(localStorage.getItem(`${phoneNumber}_${currentUser}_${password}_deposit`)) || 0;

    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = currentUser;
    }

    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting = '';
        if (hour < 12) {
            greeting = 'Good morning';
        } else if (hour < 18) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }
        greetingElement.textContent = greeting + ', ';
    }

    alert("Welcome member to DicksonHub earning platform. Start earning by clicking the earn button.");

    const earningsElement = document.getElementById('userEarnings');
    if (earningsElement) {
        earningsElement.textContent = `₦${userEarnings.toFixed(2)}`;
    }

    const depositElement = document.getElementById('userDeposit');
    if (depositElement) {
        depositElement.textContent = `₦${userDeposit.toFixed(2)}`;
    }

    const uniqueCode = generateUniqueCode(phoneNumber, currentUser, password, userEarnings);
    localStorage.setItem('uniqueCode', uniqueCode);
});

$(document).ready(function(){
    $('.slideshow-container').slick({
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        adaptiveHeight: true
    });

    const currentUser = localStorage.getItem('username');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const password = localStorage.getItem('password');
    const userEarnings = parseFloat(localStorage.getItem(`${phoneNumber}_${currentUser}_${password}_earnings`)) || 0;

    document.getElementById('username').textContent = currentUser;
    document.getElementById('userEarnings').textContent = `₦${userEarnings.toFixed(2)}`;
});

function generateUniqueCode(phoneNumber, username, password, earnings) {
    const dataString = `${phoneNumber}:${username}:${password}:${earnings}`;
    return btoa(dataString);
}

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}