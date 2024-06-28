let isNavOpen = false;

function toggleNav() {
    const sidenav = document.getElementById("sidenav");
    if (isNavOpen) {
        sidenav.style.width = "0";
        sidenav.style.opacity = "0"; // Hide the sidenav
    } else {
        sidenav.style.width = "250px";
        sidenav.style.opacity = "1"; // Show the sidenav
    }
    isNavOpen = !isNavOpen;
}