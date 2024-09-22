let isNavOpen = false; // Track whether the sidenav is open or closed

// Function to load the sidenav HTML into the page
function loadSidenav() {
const sidenavHTML = `
    <div id="sidenav" class="sidenav">
        <a href="javascript:void(0)" class="closebtn" onclick="toggleNav()">&times;</a>
        <a href="app.html"><i class="fa-solid fa-house"></i> Home</a>

        <h2 class="sidenav-section">Earn</h2>
        <a href="earn.html"><i class="fa-solid fa-dollar-sign"></i> Offerwall</a>
        <a href="task.html"><i class="fa-solid fa-tasks"></i> Task</a>
        <a href="posttask.html"><i class="fa-solid fa-circle-notch"></i> Post a Task</a>
        <a href="responsetask.html"><i class="fa-solid fa-gift"></i> Task Reward</a>
        <a href="gift.html"><i class="fa-solid fa-gift"></i> Claim Gift</a>
        <a href="shop.html"><i class="fa-solid fa-shop"></i> Shop</a>
        <a href="clicks.html"><i class="fa-solid fa-share"></i> Click to Earn</a>
        <a href="refer_earn.html"><i class="fa-solid fa-share-nodes"></i> Refer & Earn</a>

        <a href="withdraw.html"><i class="fa-solid fa-wallet"></i> Withdraw</a>
        <a href="conversion.html"><i class="fa-solid fa-exchange"></i> Convert Airtime/Data</a>
        <h2 class="sidenav-section">Information</h2>
        <a href="news.html"><i class="fa-solid fa-bell"></i> New Features/Updates</a>
<a href="contact.html"><i class="fa-solid fa-envelope"></i> Contact</a>
<a href="Help.html"><i class="fa-solid fa-circle-question"></i> Help</a>

        <a href="about.html"><i class="fa-solid fa-info-circle"></i> About Us</a>
    </div>
`;

// Insert the sidenav into the body
document.body.insertAdjacentHTML('afterbegin', sidenavHTML);


    // Attach the event listener for the hamburger icon after sidenav is loaded
    const icon = document.querySelector('.icon');
    if (icon) {
        icon.addEventListener('click', toggleNav);
    } else {
        console.error("Hamburger icon not found.");
    }
}

// Function to toggle the sidenav open and close
function toggleNav() {
    const sidenav = document.getElementById("sidenav");
    if (!sidenav) {
        console.error("Sidenav element not found.");
        return;
    }

    // Toggle the 'open' class to show/hide the sidenav
    if (isNavOpen) {
        sidenav.classList.remove('open');  // Close the sidenav
    } else {
        sidenav.classList.add('open');  // Open the sidenav
    }

    isNavOpen = !isNavOpen; // Update the state
}

// Load the sidenav once the page is fully loaded
window.addEventListener('DOMContentLoaded', function() {
    loadSidenav(); // Dynamically load the sidenav HTML
});



//fa-plus-circle or fa-upload icon to represent creating or uploading a task.

//View Task Response: For viewing task responses, the fa-eye or fa-comment-dots icon 