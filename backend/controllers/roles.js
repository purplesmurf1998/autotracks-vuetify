const Roles = require('../tables/Roles');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get roles for a specific dealership
// @route   GET /api/v1/roles
// @access  Protected
exports.getRoles = asyncHandler(async (req, res, next) => {
  const dealershipId = req.query.dealership;

  if (!dealershipId) {
    return next(
      new ErrorResponse('Must specify a dealership', 400)
    );
  }

  const roles = await Roles.find({ dealership: dealershipId });

  // send response
  res.status(201).json({
    success: true,
    payload: roles
  });
})

// @desc    Update a role
// @route   PUT /api/v1/roles/:roleId
// @access  Protected
exports.updateRole = asyncHandler(async (req, res, next) => {
  const role = await Roles.findByIdAndUpdate(req.params.roleId, req.body, {
    new: true,
    runValidators: true
  })

  // if no role is returned, role was not found and send an error response
  if (!role) {
    return next(
      new ErrorResponse(`Role with id: ${req.params.roleId} not found.`, 404)
    );
  }

  // send response
  res.status(201).json({
    success: true,
    payload: role
  });
})

// @desc    Delete a specific role
// @route   DELETE /api/v1/roles/:roleId
// @access  Authenticated
exports.deleteRole = asyncHandler(async (req, res, next) => {
  // find the role with the id provided in the request params and delete
  await Roles.findByIdAndDelete(req.params.roleId);

  // send response
  res.status(200).json({
    success: true,
    payload: {}
  });
});