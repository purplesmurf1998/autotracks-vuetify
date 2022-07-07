const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authorization");

// get the methods from the authenticationController
const {
  getSubscriptions,
  deleteSubscription,
  createSubscription,
  updateSubscription
} = require('../controllers/subscriptions');

// attach methods to the proper routes
router.route('/')
  .get(protect, getSubscriptions)
  .post(protect, createSubscription);

router.route('/:subscriptionId')
  .put(protect, updateSubscription)
  .delete(protect, deleteSubscription);

// export the router so it can be used in the server.js file
module.exports = router;