const express = require('express');
const router = express.Router();

const {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyPositions
} = require('../controllers/properties');

router.route('/')
  .post(createProperty)
  .get(getProperties);

router.route('/positions')
  .put(updatePropertyPositions);

router.route('/:propertyId')
  .put(updateProperty)
  .delete(deleteProperty);

module.exports = router;