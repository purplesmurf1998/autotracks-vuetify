const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vehicles = require('../tables/Vehicles');
const Dealerships = require('../tables/Dealerships');

// @desc        Get all vehicles for a specific dealership
// @route       GET /api/v1/vehicles
// @access      Private
exports.getVehicles = asyncHandler(async (req, res, next) => {

  // grab the dealership_ID from the body and verify that the dealership exists
  const { dealership } = req.query;

  // no dealership found
  if (!dealership) {
    return next(
      new ErrorResponse('Dealership ID must be provided', 400)
    );
  }

  const inventory = await Vehicles.find({ dealership: dealership });
  // const sold = await Vehicles.find({ dealership: dealershipId, sold: true })
  // const delivered = await Vehicles.find({ dealership: dealershipId, delivered: true })

  res.status(200).json({
    success: true,
    count: inventory.length,
    payload: inventory
  });
});

// @desc        Get a specific vehicle
// @route       GET /api/v1/vehicles/:vehicleId
// @access      Private
exports.getVehicle = asyncHandler(async (req, res, next) => {
  let vehicle = await Vehicles.findById(req.params.vehicleId);

  if (!vehicle) {
    return next(
      new ErrorResponse(`Vehicle with id ${req.params.vehicleId} not found.`, 404)
    );
  }

  res.status(200).json({
    success: true,
    payload: vehicle
  });
});

// @desc        Update a specific vehicle
// @route       PUT /api/v1/vehicles/:vehicleId
// @access      Private
exports.updateVehicle = asyncHandler(async (req, res, next) => {

  // try to update the vehicle
  const vehicle = await Vehicles.findByIdAndUpdate(req.params.vehicleId, req.body, {
    runValidators: true,
    new: true
  });

  // throw error if no vehicle returned
  if (!vehicle) {
    return next(
      new ErrorResponse(`Vehicle with id ${req.params.vehicleId} was unable to be updated.`, 404)
    );
  }

  // return data
  res.status(200).json({ success: true, payload: vehicle });
});

// @desc        Create a specific vehicle
// @route       POST /api/v1/vehicles
// @access      Private
exports.createVehicle = asyncHandler(async (req, res, next) => {

  // try to create the new vehicle
  const vehicle = await Vehicles.create(req.body);

  // return a success response
  res.status(201).json({
    success: true,
    payload: vehicle
  })
});

// @desc        Delete a specific vehicle
// @route       DELETE /api/v1/vehicles/:vehicleId
// @access      Private
exports.deleteVehicle = asyncHandler(async (req, res, next) => {
  // find vehicle property to delete
  await Vehicles.findByIdAndDelete(req.params.vehicleId);

  res.status(200).json({
    success: true,
    payload: {}
  })
});