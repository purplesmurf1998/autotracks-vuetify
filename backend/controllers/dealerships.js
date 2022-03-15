const Dealerships = require('../tables/Dealerships');
const PropertyOrders = require('../tables/PropertyOrders');
const Users = require('../tables/Users');
const Roles = require('../tables/Roles');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedFilter = require('../utils/advancedFilter');

// @desc    Create a new dealership
// @route   POST /api/v1/dealerships
// @access  Public
exports.createDealership = asyncHandler(async (req, res, next) => {
  
  const ownerId = req.body.owner;

  if (!ownerId) {
    return next(
      new ErrorResponse('Dealership must have an owner.', 400)
    );
  }

  // should throw error if no user found since using findById
  const user = await Users.findById(ownerId);

  // verify that the user creating the dealership has owner privileges
  if (!user.owner) {
    return next(
      new ErrorResponse('User is not permitted to create a dealership.', 400)
    );
  }

  // create new dealership with the data passed in the request body
  const dealership = await Dealerships.create(req.body);

  // create default roles and permissions for the dealership
  // default roles: Administration, Management, Sales Rep, Sales Rep +, Reception

  console.log(dealership);

  const temp_roles = [
    {
      dealership: dealership._id.toString(),
      title: 'Administration',
      permissions: [
        {
          resource: 'vehicle',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'location',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'account',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_list',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_property',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_sale',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true,
            approve: true
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        }
      ]
    },
    {
      dealership: dealership._id,
      title: 'Management',
      permissions: [
        {
          resource: 'vehicle',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'location',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        },
        {
          resource: 'account',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'vehicle_list',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_property',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'vehicle_sale',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false,
            approve: true
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        }
      ]
    },
    {
      dealership: dealership._id,
      title: 'Sales Rep',
      permissions: [
        {
          resource: 'vehicle',
          policy: {
            create: false,
            read: true,
            update: true,
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
            create: true,
            read: true,
            update: true,
            delete: true
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
            create: true,
            read: true,
            update: true,
            delete: true,
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
    },
    {
      dealership: dealership._id,
      title: 'Sales Rep +',
      permissions: [
        {
          resource: 'vehicle',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'location',
          policy: {
            create: false,
            read: true,
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
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_property',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'vehicle_sale',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true,
            approve: false
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        }
      ]
    },
    {
      dealership: dealership._id,
      title: 'Reception',
      permissions:[
        {
          resource: 'vehicle',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
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
            read: true,
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
            read: true,
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
            delete: false
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        }
      ]
    }
  ];

  for (let i = 0; i < temp_roles.length; i++) {
    await Roles.create(temp_roles[i]);
  }

  // create new order of properties for the owner and this dealership
  await PropertyOrders.create({
    dealership: dealership._id,
    user: user._id,
  })

  // send response
  res.status(201).json({
    success: true,
    payload: dealership
  });
});

// @desc    Get a a list of dealerships based on query parameters
// @route   GET /api/v1/dealerships
// @access  Authenticated
exports.getDealerships = asyncHandler(async (req, res, next) => {
  // run query in mongoose
  const dealerships = await advancedFilter(Dealerships, req.query);

  // send response
  res.status(200).json({
    success: true,
    payload: dealerships
  });
});

// @desc    Get a specific dealership
// @route   GET /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.getDealership = asyncHandler(async (req, res, next) => {
  let queryResponse = Dealerships.findById(req.params.dealershipId);

  // populate specific fields if some have been entered
  if (req.query.populate) {
    const fields = req.query.populate.split(',').join(' ');
    queryResponse = queryResponse.populate(fields);
  }

  // find the dealership with the id provided in the request params
  const dealership = await queryResponse;

  // if dealership not found, send an error response
  if (!dealership) {
    return next(
      new ErrorResponse(`Dealership with id: ${req.params.dealershipId} not found.`, 404)
    );
  }

  // send response
  res.status(200).json({
    success: true,
    payload: dealership
  });
});

// @desc    Get a specific dealership
// @route   PUT /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.updateDealership = asyncHandler(async (req, res, next) => {
  // find the dealership with the id provided in the request params and update
  // with the data passed in the body
  const dealership = await Dealerships.findByIdAndUpdate(req.params.dealershipId, req.body, {
    new: true,
    runValidators: true
  });

  // if no dealership is returned, dealership was not found and send an error response
  if (!dealership) {
    return next(
      new ErrorResponse(`Dealership with id: ${req.params.dealershipId} not found.`, 404)
    );
  }

  // send response
  res.status(200).json({
    success: true,
    payload: dealership
  });
});

// @desc    Delete a specific dealership
// @route   DELETE /api/v1/dealerships/:dealershipId
// @access  Authenticated
exports.deleteDealership = asyncHandler(async (req, res, next) => {
  // find the dealership with the id provided in the request params and delete
  const dealership = await Dealerships.findByIdAndDelete(req.params.dealershipId);

  // if no dealership is returned, dealership was not found and send an error response
  if (!dealership) {
    return next(
      new ErrorResponse(`Dealership with id: ${req.params.dealershipId} not found.`, 404)
    );
  }

  // send response
  res.status(200).json({
    success: true,
    payload: {}
  });
});