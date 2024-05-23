document.addEventListener("DOMContentLoaded", function () {
  const toggleIcon = document.getElementById("toggleIcon");
  const cardBody = document.querySelector(".suggestionsBody");

  toggleIcon.addEventListener("click", function () {
    cardBody.classList.toggle("expanded");
    if (cardBody.classList.contains("expanded")) {
      toggleIcon.innerHTML =
        '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7"/></svg>';
    } else {
      toggleIcon.innerHTML =
        '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>';
    }
  });

});

function openEditNameModel(){
  console.log("CLicked on the modal");
  const modal = document.getElementById("editNameDescModal");
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
}

function completeIdentification() {
  if (navigator.onLine) {
    console.log("Clicked complete identification");
    const plantid = document.getElementById("plantidInput").value;
    console.log("plantid: ", plantid);
    const payload = {
      plantIdentificationStatus: true,
    };

    console.log("Payload: ", payload);

    fetch(
      `http://localhost:5000/api/${plantid}/updatePlantIdentificationStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Plant identification status updated successfully: ", data);
        location.reload();
      })
      .catch((error) => {
        console.error("Error updating plant identification status: ", error);
      });
  } else {
    alert("You are offline, can't complete the identification for this post. Please go online.")
  }
}
