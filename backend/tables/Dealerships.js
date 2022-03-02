const mongoose = require('mongoose');

const DealershipSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [50, 'Name cannot be more than 25 characters long'],
    minlength: [5, 'Name must have at least 5 characters'],
    required: 'Name is required'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Dealership must have an owner account associated.']
  },
  geocoded_address: {
    type: Object,
    required: [true, 'Dealership must have a geocoded address']
  },
  formatted_address: {
    type: String,
    required: [true, 'Dealership must have a valid formatted address']
  },
  lat: {
    type: Number,
    required: [true, 'Dealership must have a valid latitude']
  },
  lng: {
    type: Number,
    required: [true, 'Dealership must have a valid longitude']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("Dealerships", DealershipSchema);