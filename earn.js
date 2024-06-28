 document.addEventListener('DOMContentLoaded', function () {
      const storedUsername = localStorage.getItem('username');
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      let greeting;

      if (currentHour < 12) {
        greeting = 'Good morning';
      } else if (currentHour < 18) {
        greeting = 'Good afternoon';
      } else {
        greeting = 'Good evening';
      }

      const header = document.getElementById('header');
      const usernameSpan = document.getElementById('username');

      if (storedUsername) {
        usernameSpan.textContent = storedUsername;
        header.textContent = `${greeting}, ${storedUsername}! Click any button below to sign up and start earning.`;
      } else {
        header.textContent = `${greeting}! Click any button below to sign up and start earning.`;
      }
    });

    function toggleOffer(offerInfoId, navigateBtnId) {
      var offerInfo = document.getElementById(offerInfoId);
      var navigateBtn = document.getElementById(navigateBtnId);
      
      // Toggle offer info and navigation button
      if (offerInfo.classList.contains('show')) {
        offerInfo.classList.remove('show');
        navigateBtn.style.display = 'none';
      } else {
        // Hide all offer info and navigation buttons
        var allOfferInfo = document.querySelectorAll('.offer-info');
        var allNavigateBtns = document.querySelectorAll('.navigate-btn');
        allOfferInfo.forEach(function(info) {
          info.classList.remove('show');
        });
        allNavigateBtns.forEach(function(btn) {
          btn.style.display = 'none';
        });

        // Show offer info and navigation button for the clicked offer
        offerInfo.innerHTML = "Click the button below to sign up";
        offerInfo.classList.add('show');
        navigateBtn.style.display = 'block';
      }
    }

    function navigateToPage(destination) {
      window.location.href = destination;
    }
    
    alert("Please be informed that your earnings from these sites can not be transferred to your DicksonHub account automatically. You make withdrawals from the site's dashboard.")
  
