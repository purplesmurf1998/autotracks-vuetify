const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'A zone must be associated to a dealership.']
  },
  name: {
    type: String,
    required: [true, 'A zone must have a name.']
  },
  description: String,
  path: {
    type: [Object],
    required: [true, 'A zone must have a defined perimeter with at least 3 points.']
  },
  fillColor: {
    type: String,
    required: [true, 'A zone must have a fill color.']
  },
  center: {
    type: Object,
    required: [true, 'A zone must have a defined center point.']
  },
  vehicleCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Zones', ZoneSchema);