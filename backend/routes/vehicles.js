const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authorization");

// get the methods from the authenticationController
const {
  getVehicle,
  getVehicles,
  createVehicle,
  deleteVehicle,
  updateVehicle
} = require('../controllers/vehicles');
const { notifySubscribers } = require('../controllers/notify')

// attach methods to the proper routes
router.route('/')
  .get(protect, getVehicles)
  .post(protect, createVehicle);

router.route('/:vehicleId')
  .get(protect, getVehicle)
  .put(protect, notifySubscribers, updateVehicle)
  .delete(protect, deleteVehicle);

// export the router so it can be used in the server.js file
module.exports = router;