const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealerships',
    required: [true, 'Vehicle must be associated to a dealership']
  },
  vin: {
    type: String,
    required: [true, 'Vehicle must have a \'Vehicle Identification Number\' (VIN)'],
    unique: true,
    minlength: [11, 'VIN must be 17 characters long, or at least 11 characters for vehicles manufactured before 1981'],
    maxlength: [17, 'VIN must be 17 characters long, or at least 11 characters for vehicles manufactured before 1981']
  },
  on_road_since: {
    type: Date,
    default: null
  },
  date_added: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['IN_STOCK', 'MISSING', 'SALE_REQUESTED', 'SALE_APPROVED', 'PREPPING', 'IN_REPAIR', 'IN_DELIVERY', 'DELIVERED'],
    required: [true, 'Vehicle must have a status.'],
    default: 'IN_STOCK'
  },
  location: {
    type: {
      zone: {
        type: mongoose.Schema.ObjectId,
        ref: 'Zones',
      },
      lat: {
        type: Number,
        required: [true, 'Vehicle location must have a latitude']
      },
      lng: {
        type: Number,
        required: [true, 'Vehicle location must have a longitude']
      }
    },
    default: null
  },
  properties: Object
})

// cascade delete comments, history, vehiclesale
VehicleSchema.pre('remove', async function (next) { });

module.exports = mongoose.model('Vehicles', VehicleSchema);