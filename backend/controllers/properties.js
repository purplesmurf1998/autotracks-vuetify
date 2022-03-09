const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Properties = require('../tables/Properties')

// @desc        Get all vehicle property models for a specific dealership
// @route       GET /api/v1/properties
// @access      Private
exports.getProperties = asyncHandler(async (req, res, next) => {

  const dealershipId = req.query.dealership;

  if (!dealershipId) {
    return next(
      new ErrorResponse('Must specify a dealership', 400)
    );
  }

  let query = Properties.find({ dealership: dealershipId });
  // sort results
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('position');
  }
  // run query
  const properties = await query;

  res.status(200).json({
    success: true,
    count: properties.length,
    payload: properties
  });
});

// @desc        Create a new vehicle property model
// @route       POST /api/v1/properties
// @access      Private
exports.createProperty = asyncHandler(async (req, res, next) => {
  const newProperty = req.body;

  const numProperties = await Properties.find({ dealership: req.body.dealership });
  const position = numProperties.length + 1;
  newProperty.position = position;

  const property = await Properties.create(newProperty);

  res.status(201).json({ success: true, payload: property })
});

// @desc        Update a specific vehicle property model
// @route       PUT /api/v1/properties/:propertyId
// @access      Private
exports.updateProperty = asyncHandler(async (req, res, next) => {
  // find vehicle property model to update
  const property = await Properties.findByIdAndUpdate(req.params.propertyId, req.body, {
    new: true,
    runValidators: true
  });

  // return data
  res.status(200).json({ success: true, payload: property });
});

// @desc        Delete a specific vehicle
// @route       DELETE /api/v1/properties/:propertyId
// @access      Private
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  // find vehicle property to delete
  const property = await Properties.findById(req.params.propertyId);

  const dealershipId = property.dealership;
  const oldPosition = property.position;
  // delete vehicle
  property.remove();
  // cascade positions for every property with a position above the deleted property's position
  const cascadeProperties = await Properties.find({ dealership: dealershipId, position: { $gt: oldPosition } }).sort('position');
  cascadeProperties.forEach(property => {
    property.position = property.position - 1;
    property.save();
  })
  // return data
  res.status(200).json({ success: true, payload: {} });
});

// @desc        Update the position of all vehicle properties in batch
// @route       PUT /api/v1/dealerships/:dealershipId/vehicles/properties
// @access      Private
exports.updatePropertyPositions = asyncHandler(async (req, res, next) => {
  // body of the request should have the list of vehicle properties in the new order
  // go through the list and change the positions in the backend to their new index

  const properties = req.body.properties;
  let newProperties = [];
  for (let i = 0; i < properties.length; i++) {
    // find the vehicle property
    const property = await Properties.findByIdAndUpdate(
      properties[i]._id,
      {
        position: i + 1
      },
      {
        new: true,
        runValidators: true
      }
    );
    if (!property) {
      return next(new ErrorResponse(`Vehicle property not found with id ${properties[i]._id}`, 404));
    }

    // add the property to the new list
    newProperties.push(property);
  }

  res.status(200).json({ success: true, payload: newProperties });
});