document.addEventListener("DOMContentLoaded", function () {
  // Code for login/logout button
  var storedUsername = localStorage.getItem("username");
  if (storedUsername) {
    document.getElementById("loginButton").style.display = "none"; // Hide login button
    document.getElementById("logoutButton").style.display = "block"; // Show logout button
    alert("Welcome back, " + storedUsername + "!");
  } else {
    document.getElementById("loginButton").style.display = "block"; // Show login button
    document.getElementById("logoutButton").style.display = "none"; // Hide logout button
  }

  //   Code for the user location
  document
    .getElementById("newPostButton")
    .addEventListener("click", async () => {
      try {
        const position = await getCurrentPosition();
        document.getElementById("latitudeInput").value =
          position.coords.latitude;
        document.getElementById("longitudeInput").value =
          position.coords.longitude;
      } catch (error) {
        console.error("Error retrieving location:", error);
      }
    });

  const switches = document.querySelectorAll('input[type="checkbox"]');

  // Loop through each switch
  switches.forEach((switchElement) => {
    // Add event listener for change event
    switchElement.addEventListener("change", function () {
      // Update the value attribute of the switch based on its checked status
      this.value = this.checked ? "true" : "false";
    });
  });

  // Changing the values of the new post form or the suggestion if the user is logged in
  var storedUsername = localStorage.getItem("username");
  if (storedUsername) {
    document.getElementById("userNickname").value = storedUsername;
    document.getElementById("userNickname").place = storedUsername;
    document.getElementById("suggesterUsername").value = storedUsername;
  }
});

async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation API is not supported."));
    }
  });
}

function logout() {
  localStorage.removeItem("username");
  alert("Logged out successfully.");
  document.getElementById("loginButton").style.display = "block";
  document.getElementById("logoutButton").style.display = "none"; 
  location.reload();
}

function login() {
  var username = document.getElementById("username").value;
  if (username) {
    localStorage.setItem("username", username);
    alert("Logged in successfully as " + username);
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("logoutButton").style.display = "block";
    location.reload();
  } else {
    alert("Please enter a username.");
  }
}

function openModal(modal, plantId, plantName) {
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  const plantID = modal.querySelector("#plantID");
  plantID.textContent = plantId;
  const plantNAME = modal.querySelector("#plantName");
  plantNAME.textContent = plantName;
  const plantIDinput = modal.querySelector("#plantIDInput");
  plantIDinput.value = plantId;
}

function closeModal(modal) {
  modal.style.display = "none";
}

function validateForm() {
  const fileInput = document.getElementById("fileInput").files[0];
  if (!fileInput) {
    alert("Please upload the plant image!");
    return false;
  }
  return true;
}

function displayFileName() {
  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const file = fileInput.files[0];
  fileNameDisplay.textContent = file ? file.name : "";
}
