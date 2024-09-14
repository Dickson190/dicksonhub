let isNavOpen = false; // Track whether the sidenav is open or closed

// Function to load the sidenav HTML into the page
function loadSidenav() {
    const sidenavHTML = `
        <div id="sidenav" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" onclick="toggleNav()">&times;</a>
            <a href="app.html"><i class="fas fa-home"></i> Home</a>
            <a href="earn.html"><i class="fas fa-cash-register"></i> Offerwall</a>
            <a href="task.html"><i class="fas fa-tasks"></i> Task</a>
            <a href="bean.html" class="active"><i class="fas fa-gem"></i> Upgrade Account</a>
            <a href="shop.html"><i class="fas fa-store"></i> Shop</a>
            <a href="news.html"><i class="fas fa-bell"></i> New Features/Updates</a>
            <a href="withdraw.html"><i class="fas fa-wallet"></i> Withdraw</a>
            <a href="gift.html"><i class="fa fa-gift"></i> Claim gift </a>
            <a href="refer_earn.html"><i class="fas fa-share-alt"></i> Refer & Earn</a>
            <a href="conversion.html"><i class="fas fa-exchange-alt"></i> Convert Airtime/Data</a>
            
                 

            <a href="about.html"><i class="fas fa-info-circle"></i> About Us</a>
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