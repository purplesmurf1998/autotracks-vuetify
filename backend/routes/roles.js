const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authorization");

// get the methods from the authenticationController
const {
  createRole,
  getRoles,
  updateRole,
  deleteRole
} = require('../controllers/roles');

// attach methods to the proper routes
router.route('/')
  .get(protect, getRoles)
  .post(protect, createRole);

router.route('/:roleId')
  .put(protect, updateRole)
  .delete(protect, deleteRole);

// export the router so it can be used in the server.js file
module.exports = router;