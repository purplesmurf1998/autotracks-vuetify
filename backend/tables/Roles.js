const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  dealership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dealership",
    required: [true, 'Dealership required.']
  },
  title: {
    type: String,
    required: [true, 'Title required.']
  },
  modified_at: Date,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Roles", RoleSchema);