const Users = require('../tables/Users');
const Properties = require('../tables/Properties');
const PropertyOrders = require('../tables/PropertyOrders');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
  // make sure the user being created is not an admin
  if (req.body.role == 'Administration') {
    return next(
      new ErrorResponse('Admin accounts can only be registered from the register page.', 400)
    );
  }

  const user = await Users.create(req.body);

  if (!user) {
    return next(
      new ErrorResponse('Unable to create the user', 500)
    );
  }

  // create the default property order for the user with all dealership properties active
  // 1. grab the dealership id and fetch the currently existing properties
  const properties = await Properties.find({ dealership: user.dealership });
  let order = [];
  properties.forEach(property => {
    order.push({
      property: property._id,
      visible: true
    });
  });
  let propertyOrderObj = {
    dealership: user.dealership,
    user: user._id,
    order
  }
  // 2. create the new property order
  const propertyOrder = await PropertyOrders.create(propertyOrderObj);

  if (!propertyOrder) {
    // delete the user
    await Users.findByIdAndDelete(user._id);
    return next(
      new ErrorResponse('Unable to create the property order', 500)
    );
  }

  res.status(201).json({
    success: true,
    payload: user
  });
});

// @desc    Get a a list of users based on query parameters
// @route   GET /api/v1/users
// @access  Authenticated
exports.getUsers = asyncHandler(async (req, res, next) => {
  // get the formatted query based on the advnaced filtering
  const query = advancedFilter(Users, req.query);

  // run query in mongoose
  const users = await query;

  // send response
  res.status(200).json({
    success: true,
    payload: users
  });
});

// @desc    Get a specific user
// @route   GET /api/v1/users/:userId
// @access  Authenticated
exports.getUser = asyncHandler(async (req, res, next) => {
  let queryResponse = Users.findById(req.params.userId);

  // populate specific fields if some have been entered
  if (req.query.populate) {
    const fields = req.query.populate.split(',').join(' ');
    queryResponse = queryResponse.populate(fields);
  }

  // find the dealership with the id provided in the request params
  const user = await queryResponse;

  // if user not found, send an error response
  if (!user) {
    return next(
      new ErrorResponse(`User with id ${req.params.userId} not found.`, 404)
    );
  }

  // send response
  res.status(200).json({
    success: true,
    payload: user
  })
});

// @desc    Update a specific user
// @route   PUT /api/v1/users/:userId
// @access  Authenticated
exports.updateUser = asyncHandler(async (req, res, next) => {
  // find the user with the id provided in the request params and update
  // with the data passed in the body
  const user = await Users.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true
  });

  // if no user is returned, user was not found and send an error response
  if (!user) {
    return next(
      new ErrorResponse(`User with id: ${req.params.userId} not found.`, 404)
    );
  }

  // send response
  res.status(200).json({
    success: true,
    payload: user
  });
});

// @desc    Delete a specific user
// @route   DELETE /api/v1/users/:userId
// @access  Authenticated
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // find the user with the id provided in the request params and delete
  const user = await Users.findByIdAndDelete(req.params.userId);

  // if no user is returned, user was not found and send an error response
  if (!user) {
    return next(
      new ErrorResponse(`User with id: ${req.params.userId} not found.`, 404)
    );
  }

  // send response
  res.status(200).json({
    success: true,
    payload: {}
  });
});
