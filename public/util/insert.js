// Import IndexedDB utility if running in a worker environment

if ("undefined" === typeof window) {
  importScripts("./util/idb-utility.js");
}

/**
 * Reads a file as a Data URL.
 * @param {File} file - The file to be read.
 * @returns {Promise<string>} - A promise that resolves with the file data as a Data URL.
 */
const readFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

let plantID = '';

document.addEventListener("DOMContentLoaded", function () {
  const plantForm = document.getElementById("plantForm");

  plantForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let modal = document.getElementById("newPostModal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    location.reload();
    const plantData = {
      name: document.getElementById("nameOfPlant").value,
      image: document.getElementById("fileInput").files[0], // This will handle the file as Blob locally
      createdby: document.getElementById("userNickname").value,
      dateTimeSeen: document.getElementById("dateTimePickerInput").value,
      description: document.getElementById("plantDescription").value,
      height: parseFloat(document.getElementById("plantHeight").value),
      spread: parseFloat(document.getElementById("plantSpread").value),
      hasFlowers: document.getElementById("flowerSwitch").checked,
      hasLeaves: document.getElementById("leavesSwitch").checked,
      hasFruitsOrSeeds: document.getElementById("fruitSeeds").checked,
      flowerColor: document.getElementById("flowerColor").value,
      latitude: document.getElementById("latitudeInput").value,
      longitude: document.getElementById("longitudeInput").value,
    };

    console.log("Collected Plant Data:", plantData);

    openSyncPlantsIDB().then((db) => {
      if (plantData.image) {
        readFileAsDataUrl(plantData.image)
          .then((dataUrl) => {
            plantData.image = dataUrl;
          })
          .catch((error) => {
            console.error("Error processing file:", error);
          });
      }
      addNewPlantToSync(db, plantData)
        .then(() => {
          navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
            serviceWorkerRegistration
              .showNotification("Plant App", {
                body: `New plant added! - ${plantData.name}`,
              })
              .then((r) => console.log("Notification displayed:", r))
              .catch((e) => console.error("Notification failed:", e));
          });
        })
        .catch((error) => {
          console.error("Error adding plant to DB:", error);
        });
    });
  });

  const plantSuggestion = document.getElementById("suggestionForm");
  plantSuggestion.addEventListener("submit", function (event) {
    event.preventDefault();

    let modal = document.getElementById("suggestModal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    const suggestionFormData = {
      plantID: document.getElementById("plantIDInput").value,
      suggestedName: document.getElementById("suggestion").value,
      identifiedBy: document.getElementById("suggesterUsername").value,
      status: "Not Approved",
      approved: false,
    };

    plantID = suggestionFormData.plantID;
    const plantidentificationID = Math.floor(Math.random() * 10000);
    console.log("Collected suggestion data: ", suggestionFormData);
    if (!navigator.onLine) {
      openPlantsIDB().then((db) => {
        const plantId = parseInt(suggestionFormData.plantID);
        console.log("PLANT ID: ", suggestionFormData.plantID);
        getPlantById(db, plantId).then((plant) => {
          if (plant) {
            console.log("PLANT FOUND");

            const newIdentification = {
              plantidentificationid: plantidentificationID,
              suggestedname: suggestionFormData.suggestedName,
              identifiedBy: suggestionFormData.identifiedBy,
            };

            plant.identifications.push(newIdentification);

            openPlantsIDB().then((db) => {
              const transaction = db.transaction(["plants"], "readwrite");
              const plantStore = transaction.objectStore("plants");
              const updateRequest = plantStore.put(plant);

              updateRequest.onsuccess = () => {
                console.log("Plant data updated successfully.");
                alert("You are offline. Your suggestion will be saved and synced when you are back online.");
              };

              updateRequest.onerror = (event) => {
                console.error("Error updating plant data:", event.target.error);
              };
            });
          } else {
            console.log("PLANT NOT FOUND");
          }
        });
      });
    } else if (navigator.onLine) {
      console.log("Online mode. Saving suggestion to network DB.");
      saveIdentification(
        suggestionFormData.plantID,
        plantidentificationID,
        suggestionFormData.suggestedName,
        suggestionFormData.identifiedBy
      );
    }
  });
});

/**
 * Saves the identification suggestion to the online database.
 * @param {string} plantid - The ID of the plant.
 * @param {number} identificationID - The ID of the identification.
 * @param {string} suggestionTextInput - The suggested name.
 * @param {string} identifiedBy - The user who suggested the name.
 */
function saveIdentification(
  plantid,
  identificationID,
  suggestionTextInput,
  identifiedBy
) {
  let identification = {
    plantidentificationid: identificationID,
    suggestedname: suggestionTextInput,
    identifiedby: identifiedBy,
  };
  console.log("Identification: ", identification);
  fetch(`http://localhost:5000/api/${plantid}/plantIdentification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(identification),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Identification Success:", data);
    })
    .catch((error) => {
      console.error("Identification error: ", error);
    });
}

/**
 * Retrieves identification suggestions from IndexedDB and pushes them to the online database.
 */
function getIDBIdentificationAndPushIntoNetworkDb() {
  openPlantsIDB().then((db) => {
    const plantId = parseInt(plantID);
    getPlantById(db, plantId).then((plant) => {
      if (plant) {
        console.log("PLANT FOUND");
        const saveIdentificationPromises = [];
        plant.identifications.forEach(identification => {
          saveIdentificationPromises.push(
            saveIdentification(
              plantId,
              identification.plantidentificationid,
              identification.suggestedname,
              identification.identifiedBy
            )
          );
        });
        Promise.all(saveIdentificationPromises)
          .then(() => {
            console.log("All suggestion saved successfully");
          })
          .catch(error => {
            console.error("Error saving suggestion: ", error);
          });
      } else {
        console.log("PLANT NOT FOUND IN GET IDB PUSH TO NWK");
      }
    });
  });
}

// Event listener for when the system comes back online
window.addEventListener("online", () => {
  alert("You are back online. Your suggestion will be synced now.");
  getIDBIdentificationAndPushIntoNetworkDb();
});

