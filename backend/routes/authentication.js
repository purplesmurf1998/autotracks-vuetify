const express = require('express');
const router = express.Router();

// get the methods from the authenticationController
const {
  register,
  signIn,
  logout,
  verify,
  changePassword
} = require('../controllers/authentication');

// attach methods to the proper routes
router.route('/signin').post(signIn);
router.route('/register').post(register);
router.route('/logout').get(logout);
router.route('/verify').post(verify);
router.route('/changepassword/:userId').put(changePassword);

// export the router so it can be used in the server.js file
module.exports = router;