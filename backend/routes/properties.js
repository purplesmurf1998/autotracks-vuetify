const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authorization");

const {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyOrder,
  createPropertyOrder,
  getPropertyOrder
} = require('../controllers/properties');

router.route('/')
  .post(protect, createProperty)
  .get(protect, getProperties);

router.route('/order')
  .get(protect, getPropertyOrder)
  .post(protect, createPropertyOrder);

router.route('/order/:orderId')
  .put(protect, updatePropertyOrder);

router.route('/:propertyId')
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;