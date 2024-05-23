var express = require('express');
var router = express.Router();
const plantsController = require('../controllers/plantController');
const multer = require('multer');
const fs = require('fs');
const {getSortedPlants, searchPlant} = require("../controllers/plantController");

// Configure multer for file storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var directory = 'public/images_dynamic/uploads/';
    fs.access(directory, function(error){
      if(error){
        fs.mkdir(directory, { recursive: true }, function(error){
          if(error){
            console.error('Error creating directory: ',error);
          } else{
            console.log('Directory created successfully');
            cb(null, directory);
          }
        });
      } else{
        cb(null, directory);
      }
    });
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    filename =  Date.now() + '.' + file_extension[file_extension.length-1];
    console.log(filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

/**
 * Route to render the homepage.
 * @route GET /
 */
router.get('/', async (req, res) => {
  try {
    var plants = []
    res.render('index', { plants });
  } catch (err) {
    console.error('Error while fetching data:', err);
    res.render('error', { message: 'Failed to fetch plant data' });
  }
});

/**
 * Route to get all plants.
 * @route GET /api/plants
 */
router.get('/api/plants', async (req, res) => {
  try {

    await plantsController.getAllPlants(req, res);
  } catch (err) {
    console.error('Error while fetching data:', err);
    res.render('error', { message: 'Failed to fetch plant data' });
  }
});

/**
 * Route to get sorted plants.
 * @route GET /api/plants/sorted
 */
router.get('/api/plants/sorted', getSortedPlants);


/**
 * Route to get plant details by plant ID.
 * @route GET /api/plant
 * @query {string} plantid - The ID of the plant to fetch details for.
 */
router.get('/api/plant', async (req, res) => {
  const plantid = req.query.plantid;
  req.params.plantid = plantid; 
  try {
    await plantsController.getPlantById(req, res);
  } catch (err) {
    console.error('Error while fetching plant details:', err);
    res.render('error', { message: 'Failed to fetch plant details' });
  }
});

/**
 * Route to create a new plant.
 * @route POST /api/plantCreate
 */
router.post('/api/plantCreate', upload.single('image'), async (req, res) => {
  try {

    await plantsController.createPlant(req, res);
  } catch (err) {
    console.error('Error while creating plant:', err);
    res.status(500).render('error', { message: 'Failed to create plant' });
  }
});

/**
 * Route to add a plant identification suggestion.
 * @route POST /api/:plantid/plantIdentification
 */
router.post('/api/:plantid/plantIdentification', async(req, res)=>{
  try {
    const plantIdentification = await plantsController.postPlantIdentification(req, res);
    console.log(plantIdentification);
  } catch (error) {
    console.error('Error posting plant identification', err);
    res.render('error', { message: 'Failed to post plant identification' });
  }
});

/**
 * Route to update the plant identification status.
 * @route POST /api/:plantid/updatePlantIdentificationStatus
 */
router.post('/api/:plantid/updatePlantIdentificationStatus', async(req, res) => {
  try {
    const plantIdentificationStatus = await plantsController.updatePlantIdentificationStatus(req, res);
    console.log("PLANT IDENT STATUS", plantIdentificationStatus);
  } catch (error) {
    console.error('Error updating plant identification status', err);
    res.render('error', { message: 'Failed to update plant identification status' });
    res.status(500).render('error', { message: 'Failed to create plant identification status' });
  }
});

/**
 * Route to approve a plant identification suggestion.
 * @route POST /api/:plantid/approvesuggestion
 */
router.post(`/api/:plantid/approvesuggestion`, async(req, res) => {
  try{
    const approveSuggestion = await plantsController.approveSuggestion(req, res);
    console.log("Approved suggestion: ", approveSuggestion);
  } catch(error) {
    console.error("Error approving suggestion: ", error);
  }
});

/**
 * Route to update the name and description of a plant.
 * @route POST /api/:plantid/updateNameAndDescription
 */
router.post(`/api/:plantid/updateNameAndDescription`, async(req, res) => {
  try{
    const updateNameAndDescription = await plantsController.updateNameandDescription(req, res);
    console.log("Updated name and description: ", updateNameAndDescription);
  }catch(error){
    console.error("Error updating name and description: ", error );
  }
});

/**
 * Route to like a plant.
 * @route POST /api/plants/:plantid/like
 */
router.post('/api/plants/:plantid/like', async (req, res) => {
  try {
      await plantsController.likePlant(req, res);
  } catch (err) {
      console.error('Error while liking the plant:', err);
      res.status(500).render('error', { message: 'Failed to like the plant' });
  }
})

module.exports = router;
