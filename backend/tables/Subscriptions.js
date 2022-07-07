const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealerships',
    required: [true, 'Subscription must be associated to a dealership']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Subscription must be associated to a user']
  },
  event_type: {
    type: String,
    enum: ['Vehicle Sold', 'Vehicle Delivered', 'Vehicle Available'],
    required: [true, 'Subscription must have an event type']
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Properties',
  },
  values: [],
  status: {
    type: String,
    enum: ['Enabled', 'Disabled'],
    required: [true, 'Subscription must have a status'],
    default: 'Enabled'
  },
})

module.exports = mongoose.model('Subscriptions', SubscriptionSchema);