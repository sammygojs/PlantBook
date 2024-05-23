var express = require('express');
const {searchPlant} = require("../controllers/plantController");
var router = express.Router();


// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    if (string.length === 0) {
        return ''; 
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Route for searching dbpedia details.
 */
router.get('/dbsearch', searchPlant);

/**
 * Route for fetching plant details and related database information.
 * @route GET /plantdetails
 * @queryParam {string} plantid - The ID of the plant to fetch details for.
 */
router.get('/plantdetails', async (req, res) => {
    const plantid = req.query.plantid;
    console.log(plantid);
    try {
        const response = await fetch(`http://localhost:3000/api/plantdetails/${plantid}`);
        if (response.ok) {
            const plantDetails = await response.json();
            responseTwo = await fetch(`http://localhost:3000/plantdetails/dbsearch?name=${capitalizeFirstLetter(plantDetails.name)}`)
            const plantDetailsDB = await responseTwo.json();
            res.render('plantdetails', {plantDetails, plantDetailsDB});
        } else {
            throw new Error('Failed to fetch plant data');
        }
  
    } catch (err) {
      console.error('Error while fetching data: ', err);
      res.render('error', { message: 'Failed to fetch plant data' });
    }
  });

  module.exports = router;