/**
 * Function to add a new plant to the sync-plants object store in IndexedDB.
 * @param {IDBDatabase} syncPlantIDB - The IndexedDB instance for sync plants.
 * @param {Object} plantData - The data of the plant to be added.
 * @returns {Promise} - A promise that resolves when the plant is added successfully.
 */
const addNewPlantToSync = (syncPlantIDB, plantData) => {
    return new Promise((resolve, reject) => { 
        if (plantData) {
            const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite");
            const plantStore = transaction.objectStore("sync-plants");
            const addRequest = plantStore.add(plantData);

            addRequest.onsuccess = () => {
                console.log("Added to sync-plants: " + addRequest.result);
                const getRequest = plantStore.get(addRequest.result);
                getRequest.onsuccess = () => {
                    console.log("Found " + JSON.stringify(getRequest.result))
                    navigator.serviceWorker.ready.then((sw) => {
                        sw.sync.register("sync-plant-data")
                    }).then(() => {
                        console.log("Sync registered");
                    }).catch((err) => {
                        console.log("Sync registration failed: " + JSON.stringify(err))
                    })
                };
                getRequest.onerror = (err) => {
                    console.error("Error retrieving the newly added plant:", err);
                    reject(err); 
                };
            };

            addRequest.onerror = (event) => {
                console.error("Failed to add plant to sync-plants:", event.target.error);
                reject(event.target.error);
            };
        } else {
            console.error("No plant data provided to add to sync-plants.");
            reject("No plant data provided"); 
        }
    });
};


/**
 * Function to add new plants to IndexedDB.
 * @param {IDBDatabase} plantDB - The IndexedDB instance for plants.
 * @param {Object} plants - The data of the plants to be added.
 * @returns {Promise} - A promise that resolves when all plants are added successfully.
 */
const addNewPlantsToIDB = (plantDB, plants) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");
        const addPromises = plants.plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.onsuccess = () => {
                    console.log("Added plant with ID:", addRequest.result); 
                    resolveAdd(addRequest.result);
                };
                addRequest.onerror = (event) => {
                    console.error("Error adding plant:", event.target.error);
                    rejectAdd(event.target.error);
                };
            });
        });

        Promise.all(addPromises)
            .then(results => {
                console.log("All plants added successfully.");
                resolve(results); 
            })
            .catch(error => {
                console.error("Error adding multiple plants:", error);
                reject(error);
            });
    });
};

/**
 * Function to remove all plants from IndexedDB.
 * @param {IDBDatabase} plantDB - The IndexedDB instance for plants.
 * @returns {Promise} - A promise that resolves when all plants are removed.
 */
const deleteAllExistingPlantsFromIDB = (plantDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");
        const clearRequest = plantStore.clear(); 

        clearRequest.onsuccess = () => {
            console.log("All plants have been removed from IndexedDB.");
            resolve();
        };

        clearRequest.onerror = (event) => {
            console.error("Error clearing plants from IndexedDB:", event.target.error);
            reject(event.target.error);
        };
    });
};

/**
 * Function to retrieve all plants from IndexedDB.
 * @param {IDBDatabase} plantDB - The IndexedDB instance for plants.
 * @returns {Promise} - A promise that resolves with all plants.
 */
const getAllPlantsOffline = (plantDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readonly");
        const plantStore = transaction.objectStore("plants");
        const getRequest = plantStore.getAll();
        getRequest.onsuccess = () => {
            resolve({ plants: getRequest.result });
        };
        getRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

/**
 * Function to retrieve all plants from IndexedDB.
 * @param {IDBDatabase} plantDB - The IndexedDB instance for plants.
 * @returns {Promise} - A promise that resolves with all plants.
 */
const getAllPlants = (plantDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readonly");
        const plantStore = transaction.objectStore("plants");
        const getRequest = plantStore.getAll();
        getRequest.onsuccess = () => {
            resolve(getRequest.result);
        };
        getRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

/**
 * Function to retrieve all sync plants from IndexedDB.
 * @param {IDBDatabase} syncPlantIDB - The IndexedDB instance for sync plants.
 * @returns {Promise} - A promise that resolves with all sync plants.
 */
const getAllSyncPlants = (syncPlantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncPlantIDB.transaction(["sync-plants"], "readonly");
        const plantStore = transaction.objectStore("sync-plants");
        const getAllRequest = plantStore.getAll();
        getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result);
        };

        getAllRequest.onerror = (event) => {
            reject(event.target.error); 
        };
    });
}

/**
 * Function to get a plant by its ID from IndexedDB.
 * @param {IDBDatabase} plantDB - The IndexedDB instance for plants.
 * @param {string} plantid - The ID of the plant.
 * @returns {Promise} - A promise that resolves with the plant data.
 */
const getPlantById = (plantDB, plantid) => {
    return new Promise((resolve, reject) => {
        const transaction = plantDB.transaction(["plants"], "readonly");
        const plantStore = transaction.objectStore("plants");
        const getRequest = plantStore.getAll();
        console.log("PLANT: ", getRequest);
        getRequest.onsuccess = () => {
            const plants = getRequest.result;
            const plant = plants.find(plant => plant.plantid === plantid);
            console.log(plant);
            resolve(plant);
        };
        getRequest.onerror = (event) => {
            console.log("Event error: ", event.target.error);
            reject(event.target.error);
        };
    });
};


/**
 * Function to retrieve all sync plants from IndexedDB.
 * @param {IDBDatabase} syncPlantIDB - The IndexedDB instance for sync plants.
 * @returns {Promise} - A promise that resolves with all sync plants.
 */
const getAllSyncPlantsOffline = (syncPlantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncPlantIDB.transaction(["sync-plants"], "readonly");
        const plantStore = transaction.objectStore("sync-plants");
        const getAllRequest = plantStore.getAll();
        getAllRequest.onsuccess = () => {
            resolve({ plants: getAllRequest.result });
        };

        getAllRequest.onerror = (event) => {
            reject(event.target.error); 
        };
    });
}

/**
 * Function to delete a synced plant from IndexedDB.
 * @param {IDBDatabase} syncPlantIDB - The IndexedDB instance for sync plants.
 * @param {string} id - The ID of the plant to be deleted.
 */
const deleteSyncPlantFromIDB = (syncPlantIDB, id) => {
    const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite");
    const plantStore = transaction.objectStore("sync-plants");

    const deleteRequest = plantStore.delete(id);

    deleteRequest.onsuccess = () => {
        console.log("Deleted sync plant with ID: " + id);
    };

    deleteRequest.onerror = (event) => {
        console.error("Failed to delete sync plant with ID: " + id + ", Error: ", event.target.error);
    };
}


/**
 * Function to open the IndexedDB for plant data.
 * @returns {Promise} - A promise that resolves with the database instance.
 */
function openPlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("plants-db", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target.errorCode}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('plants')) {
                db.createObjectStore('plants', { keyPath: 'plantid' });
            }
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

/**
 * Function to open the IndexedDB for sync plants.
 * @returns {Promise} - A promise that resolves with the database instance.
 */
function openSyncPlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sync-plants-db", 1);
        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target.errorCode}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('sync-plants')) {
                db.createObjectStore('sync-plants', { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}
