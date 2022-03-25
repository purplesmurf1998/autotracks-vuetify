const mongoose = require('mongoose');

const PropertyOrderSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealerships',
    required: [true, 'Property order list must be associated to a dealership']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: [true, 'Property order list must be associated to an account']
  },
  order: [{
    type: {
      property: {
        type: mongoose.Schema.ObjectId,
        ref: 'Properties',
        required: [true, 'Property order index must have a property']
      },
      visible: {
        type: Boolean,
        required: [true, 'Property order index must state if visible or not'],
        default: true
      }
    },
    default: []
  }],
  group_by: {
    type: Object,
    default: null
  }
})

module.exports = mongoose.model('PropertyOrders', PropertyOrderSchema);