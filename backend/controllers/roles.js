const Dealerships = require('../tables/Dealerships');
const Roles = require('../tables/Roles');
const Permissions = require('../tables/Permissions');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Get roles for a specific dealership
// @route   GET /api/v1/roles
// @access  Public
exports.getRoles = asyncHandler(async (req, res, next) => {
  const dealershipId = req.query.dealership;

  if (!dealershipId) {
    return next(
      new ErrorResponse('Must specify a dealership', 400)
    );
  }

  let roles = {};
  const permissions = await Permissions.find().populate({
    path: 'subject',
    match: { dealership: dealershipId }
  });

  permissions.forEach(permission => {
    roles[permission.subject.title][permission.object] = permission.permissions;
  })

  // send response
  res.status(201).json({
    success: true,
    payload: roles
  });
})