var express = require('express');
var router = express.Router();
const plantsController = require('../controllers/plantController');

/**
 * Route to get plant details by plant ID.
 * @route GET /:plantid
 * @param {string} plantid - The ID of the plant to fetch details for.
 */
router.get('/:plantid', async (req, res) => {
    try {
        const plantDetails = await plantsController.getPlantById(req, res);
        console.log('router plant details');    
        console.log(plantDetails);    
      } catch (err) {
        console.error('Error while fetching data:', err);
        res.render('error', { message: 'Failed to fetch plant data' });
      }
  });

  /**
 * Route to add a comment to a plant by plant ID.
 * @route POST /:plantid/comments
 * @param {string} plantid - The ID of the plant to add a comment to.
 */
  router.post('/:plantid/comments', async (req, res) => {
    try {
      await plantsController.addComment(req, res);
    } catch (err) {
      console.error('Error while commenting:', err);
      res.status(500).render('error', { message: 'Failed to add your comment' });
    }
  });

/**
 * Route to get comments for a plant by plant ID.
 * @route GET /:plantid/comments
 * @param {string} plantid - The ID of the plant to fetch comments for.
 */
  router.get('/:plantid/comments', async (req, res) => {
    try {

      await plantsController.getComments(req, res);
    } catch (err) {
      console.error('Error while commenting:', err);
      res.status(500).render('error', { message: 'Failed to add your comment' });
    }
  });

  module.exports = router;