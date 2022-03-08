const Roles = require('../tables/Roles');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const defaultPermissions = [
  {
    resource: 'vehicle',
    policy: {
      create: false,
      read: false,
      update: false,
      delete: false
    }
  },
  {
    resource: 'location',
    policy: {
      create: false,
      read: false,
      update: false,
      delete: false
    }
  },
  {
    resource: 'account',
    policy: {
      create: false,
      read: false,
      update: false,
      delete: false
    }
  },
  {
    resource: 'vehicle_list',
    policy: {
      create: false,
      read: false,
      update: false,
      delete: false
    }
  },
  {
    resource: 'vehicle_property',
    policy: {
      create: false,
      read: false,
      update: false,
      delete: false
    }
  },
  {
    resource: 'vehicle_sale',
    policy: {
      create: false,
      read: false,
      update: false,
      delete: false,
      approve: false
    }
  },
  {
    resource: 'dealership',
    policy: {
      create: false,
      read: false,
      update: false,
      delete: false
    }
  }
]

// @desc    Create a role for a specific dealership
// @route   POST /api/v1/roles
// @access  Protected
exports.createRole = asyncHandler(async (req, res, next) => {
  const { permissions } = req.body;

  // if no permissions defined, initialize permissions to an empty array
  let tempPermissions = permissions || [];
  let rolePermissions = defaultPermissions;

  console.log(tempPermissions);
  console.log(rolePermissions);

  rolePermissions.forEach(value => {
    const resource = value.resource;
    Object.keys(value.policy).forEach(key => {
      if (tempPermissions.includes(key + '_' + resource)) {
        value.policy[key] = true;
      }
    })
  });

  console.log(rolePermissions);

  req.body.permissions = rolePermissions;

  const role = await Roles.create(req.body);

  // send response
  res.status(201).json({
    success: true,
    payload: role
  });
})

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