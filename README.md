# Plant Recognition Web Application

Github repo @ https://github.com/sgr-0007/plant-recognition
This progressive web application allows users to record and view plant sightings, assist with identification, and engage in discussions through a real-time chat feature. This application was developed as part of the COM3504/COM6504 The Intelligent Web assignment.

## Installation

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB running on the default port

### Setup Instructions

1. **Navigate to the Project's root directory (Team_Msc06/solution/):**

2. **Install Dependencies:**
   ```bash
   npm install
   ```

### Running the Application

1. **Start the Server using the EJS bin File:**
   Start the server by the running the command below
   ```bash
   node ./bin/www
   ```
   OR
   ```bash
   npm run start
   ```

2. **Access the Application:**

   **It is recommended to clear the cache before accessing the application**.
Launch any web browser and go to http://localhost:3000 to begin using the application.

### Using the application
On the landing page, the user is given the option to ‘Login’ with their username. 
After logging in, click on the ‘New Post’ button on the navbar.
Fill in the details of the plant in the new post form and click on ‘Post’.
This application supports offline mode as well. So, even if the user is offline/disconnected from the network, this new post form will be able to store the plant details in the IDB and will automatically sync the changes to the network DB as soon as the system comes back online.
Once the plant post is visible, the post user has the option to navigate to the plant details screens, which contains the chat option for the post where they can post a comment.
Other users can view the post, add a like on it and/or post a suggestion by clicking on the ‘Suggest‘ in the bottom right corner.
On the plant details screen, only the user who originally posted the plant is able to:
View suggestions (suggested by other users) and approve the suggestion.
View plant details from DBPedia 
Edit the plant name and description 
complete the identification status of the plant.  
To make viewing posts easy, the user can make use of Sort functionality, which sorts the posts by ‘Newest’, ‘Oldest’ or ‘Name’.
The search bar can be used to search for a particular plant post.

## Features

- **Add Plant Sightings:** Users can add new plant sightings with details like date, time, location, plant description, and photos.
- **View and Sort Plant Sightings:** Sightings can be viewed and sorted by date/time or by distance (stretch goal).
- **Real-Time Chat:** Discuss plant details in real-time through a chat system integrated with each plant sighting.
- **SPARQL DBpedia Query:** The application integrates SPARQL queries to fetch detailed plant information from the DBpedia knowledge graph. When a plant's identification needs further information or verification, the system queries DBpedia to retrieve the scientific name, common name, and a detailed English description along with a URI linking to the full DBpedia entry.

## Offline Capabilities

- **Adding and Storing Sightings:** The application supports offline capabilities where users can add new plant sightings and add comments which are stored in indexed db and synced when the device is online again.

## Data Storage

- **MongoDB:** Used for storing all plant sighting data and user comments.
- **indexedDB:** Used for local storage of new plant entries when the device is offline.

## Additional Notes

- MongoDb has been hosted on Mongo Atlas.
- The application is designed to be progressive and can be used on various devices including mobile phones and laptops.
- DBpedia integration requires an active internet connection to fetch data in real-time.
