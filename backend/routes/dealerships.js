const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
  createDealership,
  getDealership,
  getDealerships,
  updateDealership,
  deleteDealership
} = require('../controllers/dealerships');

// attach methods to the proper routes
router.route('/')
  .get(getDealerships)
  .post(createDealership);

router.route('/:dealershipId')
  .get(getDealership)
  .put(updateDealership)
  .delete(deleteDealership);

// export the router so it can be used in the server.js file
module.exports = router;