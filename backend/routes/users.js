const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authorization");

// get the methods from the authenticationController
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

// attach methods to the proper routes
router.route('/')
  .post(protect, createUser)
  .get(protect, getUsers);

router.route('/:userId')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

// export the router so it can be used in the server.js file
module.exports = router;