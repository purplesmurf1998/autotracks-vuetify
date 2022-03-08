const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
  createRole,
  getRoles,
  updateRole,
  deleteRole
} = require('../controllers/roles');

// attach methods to the proper routes
router.route('/')
  .get(getRoles)
  .post(createRole);

router.route('/:roleId')
  .put(updateRole)
  .delete(deleteRole);

// export the router so it can be used in the server.js file
module.exports = router;