document.addEventListener("DOMContentLoaded", function() {

    const navbarTogglerBtn = document.getElementById("navbar-toggler-btn");
    const navbarNav = document.getElementById("navbarNav");

    navbarTogglerBtn.addEventListener("click", function () {
      navbarNav.classList.toggle("show");
    });

});
 // Check if user is already logged in on page load
function logout() {
  localStorage.removeItem("username");
  alert("Logged out successfully.");
  document.getElementById("loginButton").style.display = "block"; // Show login button
  document.getElementById("logoutButton").style.display = "none"; // Hide logout button  
  location.reload(true);
}

