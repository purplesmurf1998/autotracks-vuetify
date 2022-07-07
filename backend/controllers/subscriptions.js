const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Subscriptions = require('../tables/Subscriptions');

// @desc        Get all vehicles for a specific dealership
// @route       GET /api/v1/subscriptions
// @access      Private
exports.getSubscriptions = asyncHandler(async (req, res, next) => {

  // grab the dealership_ID from the body and verify that the dealership exists
  const { dealership } = req.query;

  // no dealership found
  if (!dealership) {
    return next(
      new ErrorResponse('Dealership ID must be provided', 400)
    );
  }

  const subscriptions = await Subscriptions.find({ dealership: dealership });

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    payload: subscriptions
  });
});

// @desc        Update a specific vehicle
// @route       PUT /api/v1/subscriptions/:subscriptionId
// @access      Private
exports.updateSubscription = asyncHandler(async (req, res, next) => {

  // try to update the vehicle
  const subscription = await Subscriptions.findByIdAndUpdate(req.params.subscriptionId, req.body, {
    runValidators: true,
    new: true
  });

  // throw error if no vehicle returned
  if (!subscription) {
    return next(
      new ErrorResponse(`subscription with id ${req.params.subscriptionId} was unable to be updated.`, 404)
    );
  }

  // return data
  res.status(200).json({ success: true, payload: subscription });
});

// @desc        Create a specific vehicle
// @route       POST /api/v1/subscriptions
// @access      Private
exports.createSubscription = asyncHandler(async (req, res, next) => {

  // try to create the new vehicle
  const subscription = await Subscriptions.create(req.body);

  // return a success response
  res.status(201).json({
    success: true,
    payload: subscription
  })
});

// @desc        Delete a specific vehicle
// @route       DELETE /api/v1/subscriptions/:subscriptionId
// @access      Private
exports.deleteSubscription = asyncHandler(async (req, res, next) => {
  // find vehicle property to delete
  await Subscriptions.findByIdAndDelete(req.params.subscriptionId);

  res.status(200).json({
    success: true,
    payload: {}
  })
});