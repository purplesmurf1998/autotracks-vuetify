const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
  getVehicle,
  getVehicles,
  createVehicle,
  deleteVehicle,
  updateVehicle
} = require('../controllers/vehicles');

// attach methods to the proper routes
router.route('/')
  .get(getVehicles)
  .post(createVehicle);

router.route('/:vehicleId')
  .get(getVehicle)
  .put(updateVehicle)
  .delete(deleteVehicle);

// export the router so it can be used in the server.js file
module.exports = router;