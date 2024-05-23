// Global variable to store plant data
let plantsData = { plants: [] }; 

// Function to search plants by name
function searchPlants() {
  clearPlantsInList();
  const searchQuery = document.getElementById('searchBar').value.trim().toLowerCase();
  console.log(searchQuery)
  if (searchQuery) {

    // Now filter the plants based on the search query and log the filtered results
    const filteredPlants = plantsData.plants.filter(plant => {
      const plantName = plant.name.toLowerCase();
      const isMatch = plantName.includes(searchQuery.toLowerCase());
      return isMatch;
    });
    insertPlantsInList({ plants: filteredPlants });
  } else {
    clearPlantsInList();
    insertPlantsInList(plantsData);
  }
}

function sortPlants(sortType) {
  clearPlantsInList();
  let sortedPlants = [...plantsData.plants];
  switch (sortType) {
    case "newest":
      sortedPlants.sort(
        (a, b) => new Date(b.createddate) - new Date(a.createddate)
      );
      break;
    case "oldest":
      sortedPlants.sort(
        (a, b) => new Date(a.createddate) - new Date(b.createddate)
      );
      break;
    case "name":
      sortedPlants.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      console.error("Unsupported sort type");
      return;
  }
  plantsData.plants = sortedPlants; // Update global plantsData with sorted data

  insertPlantsInList(plantsData); // Re-render the plant list
}

const clearPlantsInList = () => {
  const plantList = document.getElementById("plant_list");
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = "50px";
  div.style.left = "0";
  div.style.right = "0";
  div.style.bottom = "0";
  div.style.overflow = "hidden";
  div.style.display = "grid";
  div.style.placeItems = "center";
  div.style.height = "100vh";
  div.style.margin = "0";
  div.style.padding = "0";

  const flexContainer = document.createElement("div");
  flexContainer.style.display = "flex";
  flexContainer.style.flexDirection = "column";
  flexContainer.style.alignItems = "center";
  flexContainer.style.textAlign = "center";
  flexContainer.style.margin = "0";
  flexContainer.style.padding = "0";

  const img = document.createElement("img");
  img.src = "images/Drought.svg";
  img.alt = "Drought Images";
  img.style.width = "35vw";
  img.style.height = "auto";
  img.style.maxWidth = "75%";
  img.style.margin = "0";
  img.style.padding = "0";
  flexContainer.appendChild(img);

  const mainHeading = document.createElement("h1");
  mainHeading.style.fontFamily = "'Growing Garden', sans-serif";
  mainHeading.style.fontSize = "5em";
  mainHeading.style.margin = "0";
  mainHeading.style.padding = "0";
  mainHeading.textContent = "No plants found!";
  flexContainer.appendChild(mainHeading);

  const subHeading = document.createElement("h3");
  subHeading.style.fontFamily = "'Growing Garden', sans-serif";
  subHeading.style.fontSize = "3em";
  subHeading.style.margin = "0";
  subHeading.style.padding = "0";
  subHeading.textContent = "Go find some plants!";
  flexContainer.appendChild(subHeading);

  div.appendChild(flexContainer);

  plantList.innerHTML = '';
}
// }

const insertPlantsInList = (plants) => {
  const plantList = document.getElementById("plant_list");

  if (navigator.onLine && plants.plants.length === 0) {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "50px";
    div.style.left = "0";
    div.style.right = "0";
    div.style.bottom = "0";
    div.style.overflow = "hidden";
    div.style.display = "grid";
    div.style.placeItems = "center";
    div.style.height = "100vh";
    div.style.margin = "0";
    div.style.padding = "0";

    const flexContainer = document.createElement("div");
    flexContainer.style.display = "flex";
    flexContainer.style.flexDirection = "column";
    flexContainer.style.alignItems = "center";
    flexContainer.style.textAlign = "center";
    flexContainer.style.margin = "0";
    flexContainer.style.padding = "0";

    const img = document.createElement("img");
    img.src = "images/Drought.svg";
    img.alt = "Drought Images";
    img.style.width = "35vw";
    img.style.height = "auto";
    img.style.maxWidth = "75%";
    img.style.margin = "0";
    img.style.padding = "0";
    flexContainer.appendChild(img);

    const mainHeading = document.createElement("h1");
    mainHeading.style.fontFamily = "'Growing Garden', sans-serif";
    mainHeading.style.fontSize = "5em";
    mainHeading.style.margin = "0";
    mainHeading.style.padding = "0";
    mainHeading.textContent = "No plants found!";
    flexContainer.appendChild(mainHeading);

    const subHeading = document.createElement("h3");
    subHeading.style.fontFamily = "'Growing Garden', sans-serif";
    subHeading.style.fontSize = "3em";
    subHeading.style.margin = "0";
    subHeading.style.padding = "0";
    subHeading.textContent = "Go find some plants!";
    flexContainer.appendChild(subHeading);

    div.appendChild(flexContainer);

    plantList.appendChild(div);
  } else {
    plants.plants.forEach((plant) => {
      const card = document.createElement("div");
      card.className = "card my-1";
      card.style.width = "60%";

      const cardHeader = document.createElement("div");
      cardHeader.className = "card-header";

      const headerContent = document.createElement("div");
      headerContent.className =
        "d-flex justify-content-between align-items-center";

      const creatorDiv = document.createElement("div");
      creatorDiv.className = "d-flex align-items-center";

      const svgData =
        '<?xml version="1.0" ?><svg style="enable-background:new 0 0 24 24;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><g id="user"><ellipse cx="12" cy="8" rx="5" ry="6"/><path d="M21.8,19.1c-0.9-1.8-2.6-3.3-4.8-4.2c-0.6-0.2-1.3-0.2-1.8,0.1c-1,0.6-2,0.9-3.2,0.9s-2.2-0.3-3.2-0.9C8.3,14.8,7.6,14.7,7,15c-2.2,0.9-3.9,2.4-4.8,4.2C1.5,20.5,2.6,22,4.1,22h15.8C21.4,22,22.5,20.5,21.8,19.1z"/></g></g></svg>';

      const creatorIcon = new DOMParser().parseFromString(
        svgData,
        "image/svg+xml"
      ).documentElement;

      creatorIcon.setAttribute("width", "30");
      creatorIcon.setAttribute("height", "30");
      creatorIcon.setAttribute("fill", "currentColor");

      document.body.appendChild(creatorIcon);

      const creatorName = document.createElement("p");
      creatorName.className = "m-0 mx-2";
      creatorName.textContent = plant.createdby;

      creatorDiv.appendChild(creatorIcon);
      creatorDiv.appendChild(creatorName);

      const statusDiv = document.createElement("div");
      statusDiv.className = "d-flex align-items-center";

      const statusText = document.createElement("p");
      statusText.className = "m-0";
      if (plant.plantIdentificationStatus) {
        statusText.textContent = "Status: Completed";
      } else {
        statusText.textContent = "Status: In-Progress";
      }

      const detailsLink = document.createElement("a");
      detailsLink.href = `/plantdetails?plantid=${plant.plantid}`;

      const chevronIcon = document.createElement("svg");
      chevronIcon.innerHTML =
        '<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>';
      chevronIcon.setAttribute("viewBox", "0 0 16 16");
      chevronIcon.setAttribute("fill", "currentColor");
      chevronIcon.className = "bi bi-chevron-right mx-2";
      chevronIcon.style.width = "20px"; // Fixed to add "px"
      chevronIcon.style.height = "20px"; // Fixed to add "px"

      detailsLink.appendChild(chevronIcon);

      statusDiv.appendChild(statusText);
      statusDiv.appendChild(detailsLink);

      headerContent.appendChild(creatorDiv);
      headerContent.appendChild(statusDiv);
      cardHeader.appendChild(headerContent);
      card.appendChild(cardHeader);

      const date = new Date(plant.createddate);

      const createdDateText = document.createElement("p");
      createdDateText.className = "card-text";
      createdDateText.textContent = `Created on: ${date.toLocaleDateString()}`;

      const img = document.createElement("img");
      img.className = "card-img-top";
      img.alt = "Plant image";
     
      if (plant.image instanceof Blob) {
        console.log("plant image is Blob");
        img.src = URL.createObjectURL(plant.image);
        img.onload = () => {
          URL.revokeObjectURL(img.src); // Clean up the blob URL after loading
        };
      } else {
        console.log("plant image not Blob");
        // If not a Blob, handle as a normal URL or a data URL
        img.src = plant.image;
      }

      card.appendChild(img);

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
      cardBody.style.display = "flex";
      cardBody.style.justifyContent = "space-between";

      const titleDescContainer = document.createElement("div");
      titleDescContainer.style.flex = "1";

      const plantName = document.createElement("h5");
      plantName.className = "card-title";
      const plantNameLink = document.createElement("a");

      const likeButton = document.createElement("button");
      likeButton.className = "like-button";
      likeButton.setAttribute("data-plantid", plant.plantid);

      const likeIcon = new DOMParser().parseFromString(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="bi bi-heart">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
`, 'image/svg+xml').documentElement;


      likeButton.appendChild(likeIcon);

      const likeCount = document.createElement("span");
      likeCount.className = "like-count ms-2";
      likeCount.textContent = `${plant.likes || 0} Likes`;

    likeButton.addEventListener("click", function () {
      const plantId = this.getAttribute("data-plantid");

      fetch(`/api/plants/${plantId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Plant liked successfully') {
          const currentLikes = parseInt(likeCount.textContent) || 0;
          likeCount.textContent = `${currentLikes + 1} Likes`;
          likeButton.classList.add('liked');
          likeButton.disabled = true; // Disable the button after clicking
        } else {
          console.error('Failed to like the plant');
        }
      })
      .catch(error => console.error('Error:', error));
    });


      if (navigator.onLine) {
        plantNameLink.href = `/plantdetails/plantdetails?plantid=${plant.plantid}`;
      } else {
        plantNameLink.setAttribute("disabled", true);
      }
      plantNameLink.textContent = plant.name;
      plantName.appendChild(plantNameLink);

      const plantDesc = document.createElement("p");
      plantDesc.className = "card-text";
      plantDesc.textContent = plant.description;

      // Append plant name and description to the container
      titleDescContainer.appendChild(plantName);
      titleDescContainer.appendChild(plantDesc);
      if (navigator.onLine) {
        titleDescContainer.appendChild(likeButton);
        titleDescContainer.appendChild(likeCount);
      }

      const suggestionSection = document.createElement("div");
      suggestionSection.style.display = "flex";
      suggestionSection.style.alignItems = "center";
      suggestionSection.style.justifyContent = "center";
      const suggestLink = document.createElement("a");
      suggestLink.href = "";
      suggestLink.className = "text-decoration-none text-body-secondary";

      const suggestText = document.createElement("p");
      suggestText.className = "m-0";
      suggestText.textContent = "Suggest";
      suggestText.style.fontWeight = "bold";

      if (plant.plantIdentificationStatus) {
        suggestLink.style.pointerEvents = "none";
        suggestText.style.fontWeight = "normal"; 
      }

      suggestLink.addEventListener("click", function (event) {
        event.preventDefault();
        const plantid = plant.plantid;
        const plantname = plant.name;
        const suggestModal = document.getElementById("suggestModal");
        openModal(suggestModal, plantid, plantname);
      });

      const closeModalButton = document.getElementById("closeModalButton");

      closeModalButton.addEventListener("click", function (event) {
        event.preventDefault();
        closeModal(suggestModal);
      });

      suggestLink.appendChild(suggestText);

      // Create the flag icon
      const flagIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      flagIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      flagIcon.setAttribute("width", "20");
      flagIcon.setAttribute("height", "20");
      flagIcon.setAttribute("fill", "currentColor");
      flagIcon.setAttribute("class", "w-6 h-6"); // Adjust class for size
      flagIcon.setAttribute("viewBox", "0 0 24 24"); // Adjust viewBox for size
      flagIcon.style.paddingLeft = "2px"; // Add left padding

      const flagPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      flagPath.setAttribute("fill-rule", "evenodd");
      flagPath.setAttribute(
        "d",
        "M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z"
      );
      flagPath.setAttribute("clip-rule", "evenodd");
      // Add any other attributes to flagPath as needed

      flagIcon.appendChild(flagPath);

      // Append suggest link and flag icon to the suggestion section
      suggestionSection.appendChild(suggestLink);
      suggestionSection.appendChild(flagIcon);

      // Append suggestion section to the card body
      cardBody.appendChild(titleDescContainer);
      cardBody.appendChild(suggestionSection);

      card.appendChild(cardBody);
      card.appendChild(createdDateText);

      // Append the constructed card to the plant list at the beginning
      plantList.prepend(card);
    });
  }
};

// Register service worker to control making site work offline
window.onload = function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(function (reg) {
        console.log("Service Worker Registered!", reg);
      })
      .catch(function (err) {
        console.log("Service Worker registration failed: ", err);
      });
  }

  // Check if the browser supports the Notification API
  if ("Notification" in window) {
    // Check if the user has granted permission to receive notifications
    if (Notification.permission === "granted") {
      // Notifications are allowed, you can proceed to create notifications
    } else if (Notification.permission !== "denied") {
      // Request permission from the user if not already denied
      Notification.requestPermission().then(function (permission) {
        // If the user grants permission, you can proceed to create notifications
        if (permission === "granted") {
          navigator.serviceWorker.ready.then(function (
            serviceWorkerRegistration
          ) {
            serviceWorkerRegistration
              .showNotification("Plant App", {
                body: "Notifications are enabled!",
              })
              .then((r) => console.log(r));
          });
        }
      });
    }
  }

  // Fetch plant data from the server when online
  if (navigator.onLine) {
    console.log("Online mode");

    fetch("http://localhost:3000/api/plants")
      .then(function (res) {
        return res.json();
      })
      .then(function (newPlants) {
        console.log(newPlants);
        console.log(typeof newPlants);
        plantsData = newPlants;
        navigator.serviceWorker.ready
          .then((registration) => {
            return registration.sync.register("sync-plant-data");
          })
          .catch((err) => {
            console.error("Error registering sync:", err);
          });
        openPlantsIDB().then((db) => {
          insertPlantsInList(newPlants, db);
          deleteAllExistingPlantsFromIDB(db).then(() => {
            addNewPlantsToIDB(db, newPlants).then(() => {
              console.log("All new plants added to IDB");
            });
          });
        });
      });
  } else {
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.sync.register("sync-plant-data");
      })
      .catch((err) => {
        console.error("Error registering sync:", err);
      });

    // Handle offline scenario by loading plants from IndexedDB
    console.log("Offline mode");
    openPlantsIDB().then((db) => {
      getAllPlantsOffline(db).then((plants) => {
        insertPlantsInList(plants);
      });
    });

    console.log("Add plants from SYNC IDB");
    openSyncPlantsIDB().then((db) => {
      getAllSyncPlantsOffline(db).then((plants) => {
        insertPlantsInList(plants);
      });
    });
  }
};
