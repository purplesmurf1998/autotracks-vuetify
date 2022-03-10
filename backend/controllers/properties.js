const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Properties = require('../tables/Properties');
const PropertyOrders = require('../tables/PropertyOrders');
const Users = require('../tables/Users');
const Dealerships = require('../tables/Dealerships');

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

  const properties = await Properties.find({ dealership: dealershipId });

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

  const property = await Properties.create(req.body);

  // get the dealership
  const dealership = await Dealerships.findById(req.body.dealership);

  // add the property to property orders of the accounts associated to the dealership plus the owner
  // start with the owner
  const owner = await Users.findById(dealership.owner);
  // get the property order
  let propertyOrder = await PropertyOrders.findOne({ dealership: dealership._id, user: owner._id });
  console.log(propertyOrder);
  propertyOrder.order.push({ property: property._id, visible: true });
  propertyOrder.save();
  // do the rest of the accounts in the dealership
  const users = await Users.find({ dealership: dealership._id, owner: false });
  for (let i = 0; i < users.length; i++) {
    propertyOrder = await PropertyOrders.findOne({ dealership: dealership._id, user: users[i]._id });
    console.log(propertyOrder);
    propertyOrder.order.push({ property: property._id, visible: true });
    propertyOrder.save();
  }

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
  const property = await Properties.findById(req.params.propertyId)

  const dealership = await Dealerships.findById(property.dealership);

  // delete the property from property orders of the accounts associated to the dealership plus the owner
  // start with the owner
  const owner = await Users.findById(dealership.owner);
  // get the property order
  let propertyOrder = await PropertyOrders.findOne({ dealership: dealership._id, user: owner._id });
  let index = propertyOrder.order.findIndex(order => {
    return order.property._id.valueOf() == property._id.valueOf()
  });
  if (index >= 0) {
    propertyOrder.order.splice(index, 1);
    propertyOrder.save();
  }
  // do the rest of the accounts in the dealership
  const users = await Users.find({ dealership: dealership._id, owner: false });
  for (let i = 0; i < users.length; i++) {
    propertyOrder = await PropertyOrders.findOne({ dealership: dealership._id, user: users[i]._id });
    index = propertyOrder.order.findIndex(order => {
      return order.property._id.valueOf() == property._id.valueOf()
    });
    if (index >= 0) {
      propertyOrder.order.splice(index, 1);
      propertyOrder.save();
    }
  }

  property.delete();

  // return data
  res.status(200).json({ success: true, payload: {} });
});

// @desc        Update the position of all vehicle properties in batch
// @route       PUT /api/v1/properties/order/:orderId
// @access      Private
exports.updatePropertyOrder = asyncHandler(async (req, res, next) => {
  // find vehicle property order model to update
  const propertyOrder = await PropertyOrders.findByIdAndUpdate(req.params.orderId, req.body, {
    new: true,
    runValidators: true
  });

  // return data
  res.status(200).json({ success: true, payload: propertyOrder });
});

// @desc        Add a property in order for a specific user
// @route       POST /api/v1/properties/order
// @access      Private
exports.createPropertyOrder = asyncHandler(async (req, res, next) => {

  const { dealership, user } = req.body;

  const existingOrder = await PropertyOrders.find({ dealership, user });

  if (existingOrder) {
    return next(new ErrorResponse('An order for this dealership and user already exists', 400));
  }

  // create the order or properties for the account and dealership
  const order = await PropertyOrders.create(req.body);

  res.status(201).json({ success: true, payload: order })
});

// @desc        Get properties in order for a specific user
// @route       POST /api/v1/properties/order/:orderId
// @access      Private
exports.getPropertyOrder = asyncHandler(async (req, res, next) => {

  const { dealership, user } = req.query;

  const order = await PropertyOrders.findOne({ dealership, user }).populate({ path: 'order', populate: { path: 'property' } });

  if (!order) {
    return next(new ErrorResponse(`Vehicle property order not found with id ${req.params.orderId}`, 404));
  }

  res.status(201).json({ success: true, payload: order })
});