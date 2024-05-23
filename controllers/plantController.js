const Plant = require("../models/plant");

/**
 * Create a new plant.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createPlant = async (req, res) => {
  const {
    name, 
    dateTimeSeen: date_time_plant_seen, 
    description, 
    createdby,
    latitude, 
    longitude, 
    height, 
    spread, 
    flowerColor: flower_color,
    hasFlowers: has_flowers,
    hasLeaves: has_leaves, 
    hasFruitsOrSeeds: has_fruitsorseeds 
  } = req.body;

  const plantid = generateRandomID();
  const createddate = new Date();
  var image = req.file.path;
  image = image.replace('public\\', '');
  try {
    const newPlant = new Plant({
      plantid, name, description, image, latitude, longitude, createdby,
      createddate, height, spread, has_flowers,
      has_leaves, has_fruitsorseeds: has_fruitsorseeds == 'true',
      flower_color, date_time_plant_seen
    });

    await newPlant.save();

    res.redirect("/"); 
  } catch (error) {
    console.error("Error creating plant:", error);
    res.status(400).json({ message: "Failed to create plant" });
  }
};

/**
 * Generate a random ID.
 * @returns {string} - The generated random ID.
 */
function generateRandomID() {
  return Math.floor(Math.random() * 1000000).toString(); 
}
/**
 * Get all plants.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json({ plants })
  } catch (error) {
    console.error('Error fetching plants:', error);
    throw error;
  }
};

/**
 * Search for a plant by name using DBpedia.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.searchPlant = async (req, res) => {
  const plantName = req.query.name;
  if (!plantName) {
    return res.status(400).json({ error: 'Plant name is required' });
  }

  const endpointUrl = 'https://dbpedia.org/sparql';
  const resourceUrl = `http://dbpedia.org/resource/${encodeURIComponent(plantName)}`;

  const sparqlQuery = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?label ?description
    WHERE {
      <${resourceUrl}> rdfs:label ?label .
      <${resourceUrl}> dbo:abstract ?description .
      FILTER (langMatches(lang(?label), "en") && langMatches(lang(?description), "en"))
    } LIMIT 1`;

  const encodedQuery = encodeURIComponent(sparqlQuery);
  const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.bindings.length > 0) {
      const bindings = data.results.bindings[0];
      res.json({
        label: bindings.label.value,
        description: bindings.description.value,
        url: `http://dbpedia.org/page/${encodeURIComponent(plantName)}`
      });
    } else {
      res.status(404).json({
        label: 'No data found',
        description: 'No description available'
      });
    }
  } catch (error) {
    console.error('Error fetching plant data from DBpedia', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

/**
 * Get sorted plants based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getSortedPlants = async (req, res) => {
  const { sort, order = 'desc', has_flowers, has_leaves, has_fruitsorseeds } = req.query;
  let query = {};

  if (has_flowers) query.has_flowers = has_flowers === 'true';
  if (has_leaves) query.has_leaves = has_leaves === 'true';
  if (has_fruitsorseeds) query.has_fruitsorseeds = has_fruitsorseeds === 'true';

  try {
    let sortOptions = {};
    if (sort) {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions['createddate'] = -1; 
    }

    let plants = await Plant.find(query).sort(sortOptions);
    res.json({ success: true, data: plants });
  } catch (error) {
    console.error('Error fetching sorted plants:', error);
    res.status(500).json({ success: false, message: "Failed to fetch sorted plants", error: error.message });
  }
};

/**
 * Get a plant by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getPlantById = async (req, res) => {
  const { plantid } = req.params;
  try {
    console.log("Plant ID:", plantid);
    const plant = await Plant.findOne({ plantid });
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Add an identification suggestion to a plant.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.postPlantIdentification = async (req, res) => {
  const { plantid } = req.params;
  const { suggestedname, identifiedby } = req.body;
  try {
    if(!plantid || !suggestedname || !identifiedby){
      return res.status(500).json({ error: 'Missing required fields' });
    }
    console.log("Plant ID for identification: ", plantid);
    console.log("Plant identification details: ", suggestedname, ", ",identifiedby);
    const plant = await Plant.findOne({ plantid });

    if(!plant){
      return res.status(404).json({ error: 'Plant not found' });
    }
    const identificationIndex = plant.identifications.findIndex(x => x.suggestedname === suggestedname && x.identifiedby === identifiedby);

    if (identificationIndex === -1) {
      const newIdentification = {
        plantidentificationid: generateRandomID(),
        suggestedname,
        identifiedby,
      };
      plant.identifications.push(newIdentification);

    }

    const updatedIdentification = await plant.save();
    res.status(201).json({ message: 'Plant identification added successfully', identification: updatedIdentification.identifications});

  } catch (error) {
    console.error('Error adding plant identification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Approve a suggested plant identification.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.approveSuggestion = async (req, res) => {
  const { plantid } = req.params;
  const { suggestedname } = req.body;
  try {
    if(!plantid){
      return res.status(400).json({ error: 'Plant id required' });
    }
    console.log("Plant ID for identification: ", plantid);
    console.log("Plant identification details: ", suggestedname);
    const plant = await Plant.findOneAndUpdate(
      { plantid: plantid },
      { $set: { name: suggestedname } },
      { new: true }
    );
    if(!plant){
      return res.status(404).json({ message: "Plant not found" });
    }
    return res.status(200).json({ message: "Plant identification status updated successfully", plant });
  } catch (error) {
    console.error("Error updating suggested name:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Update the plant identification status.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.updatePlantIdentificationStatus = async (req, res) => {
  const { plantid } = req.params;
  const plantidentificationStatus = true;
  try {
    console.log("PLANT ID: ", plantid);
    console.log("IDENT STATUS: ", true); 
    
    const plant = await Plant.findOneAndUpdate(
      { plantid: plantid },
      { $set: { plantIdentificationStatus: plantidentificationStatus } },
      { new: true }
    );
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    return res.status(200).json({ message: "Plant identification status updated successfully", plant });
  } catch (error) {
    console.error("Error updating plant identification status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Update the name and description of a plant.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.updateNameandDescription = async (req, res) => {
  const { plantid } = req.params;
  const { editedname, editeddescription } = req.body;
  try {
    if(!plantid){
      return res.status(400).json({ error: 'Plant id required' });
    }
    console.log("Plant ID for updation: ", plantid);
    console.log("Plant updated name: ", editedname);
    console.log("Plant updated name: ", editeddescription);
    const plant = await Plant.findOneAndUpdate(
      { plantid: plantid },
      { $set: { name: editedname, description: editeddescription } },
      { new: true }
    );
    if(!plant){
      return res.status(404).json({ message: "Plant not found" });
    }
    return res.status(200).json({ message: "Plant name and description updated successfully", plant });
  } catch (error) {
    console.error("Error updating name and description:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Add a comment to a plant.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.addComment = async (req, res) => {
  const { plantid } = req.params;
  const { comment, commentedby, updateCommentId } = req.body;

  if (!plantid || !comment) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const plant = await Plant.findOne({ plantid });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
      const commentIndex = plant.comments.findIndex(x => x.comment === comment && x.commentedby === commentedby);

      if (commentIndex === -1) {
      const newComment = {
        commentid: Math.floor(Math.random() * 100000) + 1, 
        commentedby: commentedby,
        comment : comment,
      };

      plant.comments.push(newComment);
      }   

    const updatedPlant = await plant.save();
    return res.status(200).json({ message: 'Comment added successfully', comment: updatedPlant.comments });

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }

}

/**
 * Get comments for a plant.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getComments = async (req, res) => {
  const { plantid } = req.params;

  try {
    const plant = await Plant.findOne({ plantid });
    const comments = plant.comments;
    res.json({ comments });
  }
  catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Get a plant by its ID from the database.
 * @param {string} plantId - The ID of the plant.
 * @returns {Promise<Object>} - The plant object.
 */
const getPlantByIdFromDB = async (plantId) => {
  try {
      const plant = await Plant.findOne({ plantid: plantId });
      return plant;
  } catch (err) {
      console.error('Error fetching plant by ID:', err);
      throw err;
  }
};


/**
 * Update a plant in the database.
 * @param {Object} plant - The plant object to update.
 * @returns {Promise<void>} - A promise that resolves when the plant is updated.
 */
const updatePlantInDB = async (plant) => {
  try {
      await plant.save();
  } catch (err) {
      console.error('Error updating plant:', err);
      throw err;
  }
};

/**
 * Like a plant.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.likePlant = async (req, res) => {
  const plantId = req.params.plantid;
  try {
      const plant = await getPlantByIdFromDB(plantId);
      if (!plant) {
          return res.status(404).send({ message: 'Plant not found' });
      }

      plant.likes = (plant.likes || 0) + 1; 

      await updatePlantInDB(plant); 
      res.status(200).send({ message: 'Plant liked successfully', likes: plant.likes });
  } catch (err) {
      console.error('Error while liking the plant:', err);
      res.status(500).send({ message: 'Failed to like the plant' });
  }
};


