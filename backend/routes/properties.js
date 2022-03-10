const express = require('express');
const router = express.Router();

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
  .post(createProperty)
  .get(getProperties);

router.route('/order')
  .get(getPropertyOrder)
  .post(createPropertyOrder);

router.route('/order/:orderId')
  .put(updatePropertyOrder);

router.route('/:propertyId')
  .put(updateProperty)
  .delete(deleteProperty);

module.exports = router;