// Import utility script for IndexedDB operations
importScripts('./util/idb-utility.js');

/**
 * Install event to cache the initial application shell.
 * @event install
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('plant-static')
            .then(cache => {
                console.log('Opened cache');
                cache.addAll([
                '/']);
                return cache;
            })
            .catch(error => {
                console.error('Failed to open cache', error);
            })
    );
});


/**
 * Activate event to clean up old caches.
 * @event activate
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return Promise.all(keys.map(key => {
                if (key !== "plant-static") {
                    console.log('Service Worker: Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        })()
    );
});

/**
 * Fetch event to serve cached content when offline and cache new requests.
 * @event fetch
 */
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).then(response => {
            if (response && response.status === 200 && response.type === 'basic') {
                // IMPORTANT: Clone the response. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                const responseToCache = response.clone();

                caches.open('plant-static').then(cache => {
                    cache.put(event.request, responseToCache);
                });
            }
            return response;
        }).catch(error => {
            // If the network request fails, try to get from the cache.
            return caches.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                return new Response("Unable to fetch data, and no cache available.", {
                    status: 404,
                    statusText: 'Not Found'
                });
            });
        })
    );
});

/**
 * Sync event to synchronize new plant data when the connection is back online.
 * @event sync
 */
self.addEventListener('sync', event => {
    if (event.tag === 'sync-plant-data') {
        console.log('Service Worker: Syncing new Plants');
        event.waitUntil(
            openSyncPlantsIDB().then((plantDB) => {
                return getAllSyncPlants(plantDB).then(plants => {
                    console.log("plants")
                    console.log(plants)
                    return Promise.all(plants.map(plant => {
                        console.log('Service Worker: Syncing plant:', plant);
                        const formData = new FormData();
                        
                        for (const key in plant) {
                            formData.append(key, plant[key]);
                            console.log("key: ",key)
                            console.log("plant[key]: ",plant[key])
                        }
                        return fetch('http://localhost:3000/api/plantCreate', {
                            method: 'POST',
                            body: formData
                        })
                        .then(data => {
                            console.log('Service Worker: Plant synced successfully:', data);
                            deleteSyncPlantFromIDB(plantDB, plant.id);
                            self.registration.showNotification('Plants Synced', {
                                body: 'Plants synced successfully!',
                            });
                        })
                        .catch(error => {
                            console.error('Service Worker: Error syncing plant:', plant, error);
                        });
                    }));
                })
            })
        );
    }
});