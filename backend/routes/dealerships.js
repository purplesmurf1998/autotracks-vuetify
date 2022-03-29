const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authorization");

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
  .get(protect, getDealerships)
  .post(protect, createDealership);

router.route('/:dealershipId')
  .get(protect, getDealership)
  .put(protect, updateDealership)
  .delete(protect, deleteDealership);

// export the router so it can be used in the server.js file
module.exports = router;