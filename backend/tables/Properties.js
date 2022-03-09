const mongoose = require('mongoose')

const PropertySchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: [true, 'Vehicle property model must be associated to a dealership']
  },
  label: {
    type: String,
    required: [true, 'Vehicle property must have a header name']
  },
  key: String,
  input_type: {
    type: String,
    enum: ['Text', 'Number', 'Currency', 'Date', 'Dropdown', 'List'],
    required: [true, 'Vehicle property must have an input type']
  },
  options: [String],
  visible: {
    type: Boolean,
    default: true
  },
  position: {
    type: Number,
    required: [true, 'Vehicle property model must have a position']
  },
  required: {
    type: Boolean,
    default: true
  },
  description: String
});

// Create the key from the label
PropertySchema.pre('save', async function (next) {
  // create key
  this.key = this.label.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return "";
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });;
  next();
});

// Update the key from the label
PropertySchema.pre('findOneAndUpdate', async function (next) {
  // create key
  if (this._update.label) {
    this._update.key = this._update.label.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });;
  }
  next();
});

module.exports = mongoose.model('Properties', PropertySchema);