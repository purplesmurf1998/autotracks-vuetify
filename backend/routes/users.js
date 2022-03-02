const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
  getUsers,
  getUser,
  updateUser
} = require('../controllers/users');

// attach methods to the proper routes
router.route('/').get(getUsers);

router.route('/:userId')
  .get(getUser)
  .put(updateUser);

// export the router so it can be used in the server.js file
module.exports = router;