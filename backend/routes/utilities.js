const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authorization");

// get the methods from the authenticationController
const {
  geocodeAddress
} = require('../controllers/utilities');

// attach methods to the proper routes
router.route('/geocode').post(geocodeAddress);

// export the router so it can be used in the server.js file
module.exports = router;