const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const NodeGeocoder = require('node-geocoder');

const geocoderOptions = {
  provider: 'google',
  apiKey: 'AIzaSyDnzuP55GknIhhOh5L1pJbpPc5DBkc_2pM'
}

const geocoder = NodeGeocoder(geocoderOptions);

// @desc    Geocode an address
// @route   POST /api/v1/utils/geocode
// @access  Private
exports.geocodeAddress = asyncHandler(async (req, res, next) => {

  let address = req.body.street + " " + req.body.city + ", " + req.body.provinceState + " " + req.body.country;

  const geocodedAddress = await geocoder.geocode(address);

  res.status(201).json({
    success: true,
    payload: geocodedAddress[0]
  });
})